import { TooManyRequestError, ValidationError } from "@/definition";
import { safeString } from "@/libs/safe-type";
import { prisma } from "@/libs/prisma";
import type { NextRequest } from "next/server";
import { accessCheck } from "@/libs/access-check";
import { getStatus } from "@/libs/get-status";
import { checkValidPassword, isEmptyString } from "@/libs/check-string";
import { mailFrom, changePasswordMailTitle, changePasswordMailBody } from "@/libs/mail-template";
import { hashPass } from "@/libs/password";
import { Resend } from "resend";

interface Data {
	params: {
		code: string;
	};
}

export const PUT = async (req: NextRequest, { params }: Data): Promise<Response> => {
	let status = 500;

	try {
		if (!(await accessCheck(req))) {
			throw new TooManyRequestError();
		}

		const recoveryCode = safeString(params.code);

		const body = await req.json();
		const password = safeString(body.password);
		console.log(recoveryCode, password);

		if (password === null) {
			throw new ValidationError();
		}

		if (isEmptyString(password)) {
			throw new ValidationError();
		}

		if (checkValidPassword(password).status !== "success") {
			throw new ValidationError();
		}

		if (recoveryCode === null) {
			throw new ValidationError();
		}

		await prisma.$transaction(async (prisma) => {
			// リカバリーコードの存在チェック
			const userRecoveryCodeResult = await prisma.userRecoveryCode.findUnique({
				where: {
					code: recoveryCode
				}
			});

			if (userRecoveryCodeResult === null) {
				throw new Error();
			}

			// 対象のアドレスで認証済みのユーザーを取得
			const userResult = await prisma.user.findFirst({
				select: { id: true, email: true },
				where: { email: userRecoveryCodeResult.email, verified: true, deleted: false }
			});

			// 対象のアドレスのユーザーが存在しない場合はエラー
			if (userResult === null) {
				throw new Error();
			}

			// パスワードを変更
			await prisma.user.update({
				data: {
					password: await hashPass(password)
				},
				where: {
					id: userResult.id
				}
			});

			// リカバリーコードを削除
			await prisma.userRecoveryCode.deleteMany({
				where: {
					email: userResult.email
				}
			});

			const resend = new Resend(process.env.RESEND_API_KEY ?? "");

			const sendEmailResult = await resend.emails.send({
				from: mailFrom,
				to: userResult.email,
				subject: changePasswordMailTitle,
				html: changePasswordMailBody()
			});

			if (sendEmailResult.data === null) {
				throw new Error(sendEmailResult.error?.message ?? "");
			}
		});

		status = 200;
	} catch (e) {
		console.error(e);

		status = getStatus(e);
	}

	return new Response(JSON.stringify({}), {
		status
	});
};
