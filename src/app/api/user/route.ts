import { TooManyRequestError, ValidationError } from "@/definition";
import { safeString } from "@/libs/safe-type";
import { isEmailString, isEmptyString, checkValidPassword } from "@/libs/check-string";
import { prisma } from "@/libs/prisma";
import type { AddUserResponse } from "@/type";
import { hashPass } from "@/libs/password";
import { accessCheck } from "@/libs/access-check";
import type { NextRequest } from "next/server";
import { getStatus } from "@/libs/get-status";
import { Resend } from "resend";
import { mailFrom, verifyMailTitle, verifyMailBody } from "@/libs/mail-template";

export const POST = async (req: NextRequest): Promise<Response> => {
	let status = 500;
	let data: AddUserResponse = null;

	try {
		if (!(await accessCheck(req))) {
			throw new TooManyRequestError();
		}

		const body = await req.json();

		const email = safeString(body.email);
		const password = safeString(body.password);

		if (email === null || password === null) {
			throw new ValidationError();
		}

		if (isEmptyString(email) || isEmptyString(password)) {
			throw new ValidationError();
		}

		if (checkValidPassword(password).status !== "success") {
			throw new ValidationError();
		}

		if (!isEmailString(email)) {
			throw new ValidationError();
		}

		await prisma.$transaction(async (prisma) => {
			// 対象のアドレスで認証済みのユーザーを取得
			const userResult = await prisma.user.findFirst({
				select: { id: true },
				where: { email, verified: true }
			});

			// 対象のアドレスで認証済みユーザーがいた場合はエラー
			if (userResult !== null) {
				throw new Error();
			}

			const addUserResult = await prisma.user.create({
				data: {
					email,
					password: await hashPass(password)
				}
			});

			data = {
				id: addUserResult.id,
				email: addUserResult.email
			};

			const createVerifyCodeResult = await prisma.userVerifyCode.create({
				data: {
					user_id: addUserResult.id
				}
			});

			const resend = new Resend(process.env.RESEND_API_KEY ?? "");

			const sendEmailResult = await resend.emails.send({
				from: mailFrom,
				to: email,
				subject: verifyMailTitle,
				html: verifyMailBody(createVerifyCodeResult.code)
			});

			if (sendEmailResult.data === null) {
				throw new Error(sendEmailResult.error?.message ?? "");
			}
		});

		status = 200;
	} catch (e) {
		data = null;
		console.error(e);

		status = getStatus(e);
	}

	return new Response(JSON.stringify(data), {
		status
	});
};
