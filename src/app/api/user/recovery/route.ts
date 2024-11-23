import { TooManyRequestError, ValidationError } from "@/definition";
import { safeString } from "@/libs/safe-type";
import { prisma } from "@/libs/prisma";
import type { NextRequest } from "next/server";
import { accessCheck } from "@/libs/access-check";
import { getStatus } from "@/libs/get-status";
import { isEmailString, isEmptyString } from "@/libs/check-string";
import { recoveryMailBody, recoveryMailTitle, mailFrom } from "@/libs/mail-template";
import { Resend } from "resend";

export const POST = async (req: NextRequest): Promise<Response> => {
	let status = 500;

	try {
		if (!(await accessCheck(req))) {
			throw new TooManyRequestError();
		}

		const body = await req.json();

		const email = safeString(body.email);

		if (email === null) {
			throw new ValidationError();
		}

		if (isEmptyString(email)) {
			throw new ValidationError();
		}

		if (!isEmailString(email)) {
			throw new ValidationError();
		}

		await prisma.$transaction(async (prisma) => {
			const userResult = await prisma.user.findUnique({
				where: {
					email
				}
			});

			if (userResult !== null) {
				const createRecoveryCodeResult = await prisma.userRecoveryCode.create({
					data: {
						email
					}
				});

				const resend = new Resend(process.env.RESEND_API_KEY ?? "");

				const sendEmailResult = await resend.emails.send({
					from: mailFrom,
					to: email,
					subject: recoveryMailTitle,
					html: recoveryMailBody(createRecoveryCodeResult.code)
				});

				if (sendEmailResult.data === null) {
					throw new Error(sendEmailResult.error?.message ?? "");
				}
			}
		});

		const randam = Math.floor(Math.random() * 1500);
		await new Promise((resolve) => setTimeout(resolve, randam));

		status = 200;
	} catch (e) {
		console.error(e);

		status = getStatus(e);
	}

	return new Response(JSON.stringify({}), {
		status
	});
};
