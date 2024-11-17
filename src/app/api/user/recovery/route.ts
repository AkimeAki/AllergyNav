import { ForbiddenError, TooManyRequestError, ValidationError } from "@/definition";
import { safeString } from "@/libs/safe-type";
import { prisma } from "@/libs/prisma";
import type { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/libs/auth";
import { getToken } from "next-auth/jwt";
import { accessCheck } from "@/libs/access-check";
import { getStatus } from "@/libs/get-status";
// import { recoveryMailBody, recoveryMailTitle, mailFrom } from "@/libs/mail-template";
// import { Resend } from "resend";

interface Data {
	params: {
		id: string;
	};
}

export const POST = async (req: NextRequest, { params }: Data): Promise<Response> => {
	let status = 500;

	try {
		if (!(await accessCheck(req))) {
			throw new TooManyRequestError();
		}

		const userId = safeString(params.id);

		if (userId === null) {
			throw new ValidationError();
		}

		const session = await getServerSession(nextAuthOptions);
		const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

		const authenticated = session !== null && token !== null && userId === safeString(session.user?.id);

		if (!authenticated) {
			throw new ForbiddenError();
		}

		await prisma.$transaction(async (prisma) => {
			const recoveryCodeResult = await prisma.userRecoveryCode.findUnique({
				where: {
					user_id: userId
				}
			});

			if (recoveryCodeResult !== null) {
				await prisma.userRecoveryCode.delete({
					where: {
						user_id: userId
					}
				});
			}

			const createRecoveryCodeResult = await prisma.userRecoveryCode.create({
				data: {
					user_id: userId
				}
			});

			// const resend = new Resend(process.env.RESEND_API_KEY ?? "");

			// const sendEmailResult = await resend.emails.send({
			// 	from: mailFrom,
			// 	to: result.email,
			// 	subject: recoveryMailTitle,
			// 	html: recoveryMailBody(createRecoveryCodeResult.code)
			// });

			// if (sendEmailResult.data === null) {
			// 	throw new Error(sendEmailResult.error?.message ?? "");
			// }
		});

		status = 200;
	} catch (e) {
		console.error(e);

		status = getStatus(e);
	}

	return new Response(null, {
		status
	});
};