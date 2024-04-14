import { ForbiddenError, TooManyRequestError, ValidationError } from "@/definition";
import type { AddCommentResponse, GetCommentsResponse } from "@/type";
import { safeString } from "@/libs/safe-type";
import type { NextRequest } from "next/server";
import { isEmptyString } from "@/libs/check-string";
import { prisma } from "@/libs/prisma";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/route";
import { getToken } from "next-auth/jwt";
import { accessCheck } from "@/libs/access-check";
import { getStatus } from "@/libs/get-status";

interface Data {
	params: {
		id: string;
	};
}

export const GET = async (req: NextRequest, { params }: Data): Promise<Response> => {
	let data: GetCommentsResponse = null;
	let status = 500;

	try {
		if (!(await accessCheck(req))) {
			throw new TooManyRequestError();
		}

		const storeId = safeString(params.id);

		if (storeId === null) {
			throw new ValidationError();
		}

		const result = await prisma.storeComment.findMany({
			select: {
				id: true,
				title: true,
				content: true,
				store_id: true,
				user_id: true,
				updated_at: true,
				created_at: true
			},
			where: {
				deleted: false,
				store_id: storeId
			}
		});

		data = [];
		for (const item of result) {
			data.push({
				id: item.id,
				title: item.title,
				user_id: item.user_id,
				content: item.content,
				updated_at: item.updated_at,
				created_at: item.created_at
			});
		}

		status = 200;
	} catch (e) {
		console.error(e);
		data = null;

		status = getStatus(e);
	}

	return new Response(JSON.stringify(data), {
		status
	});
};

export const POST = async (req: NextRequest, { params }: { params: { id: string } }): Promise<Response> => {
	let status = 500;
	let data: AddCommentResponse = null;

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

		const title = safeString(body.title);
		const content = safeString(body.content);
		const userId = safeString(session?.user?.id);
		const storeId = safeString(params.id);

		if (title === null || content === null || storeId === null) {
			throw new ValidationError();
		}

		if (userId === null) {
			throw new ForbiddenError();
		}

		if (isEmptyString(title) || isEmptyString(content)) {
			throw new ValidationError();
		}

		const userResult = await prisma.user.findFirstOrThrow({
			select: {
				verified: true
			},
			where: {
				id: userId
			}
		});

		if (!userResult.verified) {
			throw new ForbiddenError();
		}

		const result = await prisma.storeComment.create({
			data: {
				title,
				content,
				store_id: storeId,
				user_id: userId
			}
		});

		data = {
			id: result.id,
			title: result.title,
			content: result.content,
			user_id: result.user_id,
			created_at: result.created_at,
			updated_at: result.updated_at
		};

		status = 200;
	} catch (e) {
		console.error(e);
		data = null;

		status = getStatus(e);
	}

	return new Response(JSON.stringify(data), {
		status
	});
};
