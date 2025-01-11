import { ForbiddenError, TooManyRequestError, ValidationError } from "@/definition";
import { safeString } from "@/libs/safe-type";
import { isEmptyString } from "@/libs/check-string";
import { prisma } from "@/libs/prisma";
import type { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/libs/auth";
import { getToken } from "next-auth/jwt";
import { accessCheck } from "@/libs/access-check";
import { getStatus } from "@/libs/get-status";
import { isVerifiedUser } from "@/libs/check-verified-user";
import { retryFetch } from "@/libs/retry-fetch";

export const POST = async (req: NextRequest): Promise<Response> => {
	let status = 500;

	const session = await getServerSession(nextAuthOptions);
	const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

	try {
		if (!(await accessCheck(req))) {
			throw new TooManyRequestError();
		}

		if (session === null || token === null) {
			throw new ForbiddenError();
		}

		const body = await req.json();

		const menuId = safeString(body.menuId);
		const reason = safeString(body.reason);
		const userId = safeString(session?.user?.id);
		const webhookUrl = safeString(process.env.REQUEST_DISCORD_WEBHOOK_URL);

		if (menuId === null || reason === null || webhookUrl === null) {
			throw new ValidationError();
		}

		if (userId === null) {
			throw new ForbiddenError();
		}

		if (isEmptyString(menuId) || isEmptyString(reason)) {
			throw new ValidationError();
		}

		if (!(await isVerifiedUser(userId))) {
			throw new ForbiddenError();
		}

		await prisma.menu.findUniqueOrThrow({
			select: {
				id: true
			},
			where: {
				id: menuId
			}
		});

		let randomColor = "";
		for (let i = 0; i < 6; i++) {
			randomColor += "0123456789abcdef"[(16 * Math.random()) | 0];
		}

		await retryFetch(
			webhookUrl,
			{
				method: "POST",
				headers: {
					"Content-type": "application/json"
				},
				body: JSON.stringify({
					embeds: [
						{
							title: "メニューの削除申請だ！",
							fields: [
								{
									name: "メニューID",
									value: menuId,
									inline: true
								},
								{
									name: "申請者のユーザーID",
									value: userId,
									inline: true
								},
								{
									name: "理由",
									value: reason
								}
							],
							color: parseInt(randomColor, 16),
							timestamp: new Date()
						}
					]
				})
			},
			5
		);

		status = 200;
	} catch (e) {
		console.error(e);

		status = getStatus(e);
	}

	return new Response(JSON.stringify({}), {
		status
	});
};
