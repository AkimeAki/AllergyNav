import { ForbiddenError, TooManyRequestError, ValidationError } from "@/definition";
import { safeString } from "@/libs/safe-type";
import { isEmptyString } from "@/libs/check-string";
import { prisma } from "@/libs/prisma";
import type { EditStoreResponse, GetStoreResponse } from "@/type";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/route";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { accessCheck } from "@/libs/access-check";
import { getStatus } from "@/libs/get-status";

interface Data {
	params: {
		id: string;
	};
}

export const GET = async (req: NextRequest, { params }: Data): Promise<Response> => {
	let status = 500;
	let data: GetStoreResponse = null;

	try {
		if (!(await accessCheck(req))) {
			throw new TooManyRequestError();
		}

		const storeId = safeString(params.id);

		if (storeId === null) {
			throw new ValidationError();
		}

		const result = await prisma.store.findUniqueOrThrow({
			where: { id: storeId },
			select: {
				id: true,
				name: true,
				address: true,
				description: true,
				updated_at: true,
				created_at: true,
				created_user_id: true,
				updated_user_id: true
			}
		});

		data = result;
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

export const PUT = async (req: NextRequest, { params }: { params: { id: string } }): Promise<Response> => {
	let status = 500;
	let data: EditStoreResponse = null;

	const session = await getServerSession(nextAuthOptions);
	const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

	try {
		if (!(await accessCheck(req))) {
			throw new TooManyRequestError();
		}

		if (session === null && token === null) {
			throw new ForbiddenError();
		}

		const body = await req.json();

		const name = safeString(body.name);
		const address = safeString(body.address);
		const description = safeString(body.description);
		const storeId = safeString(params.id);
		const userId = safeString(session?.user?.id);

		if (name === null || address === null || description === null || storeId === null) {
			throw new ValidationError();
		}

		if (userId === null) {
			throw new ForbiddenError();
		}

		if (isEmptyString(name)) {
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

		await prisma.$transaction(async (prisma) => {
			const storeInsertResult = await prisma.store.update({
				where: { id: storeId },
				data: {
					name,
					address,
					description,
					updated_user_id: userId
				}
			});

			data = {
				id: storeInsertResult.id,
				name: storeInsertResult.name,
				address: storeInsertResult.address,
				description: storeInsertResult.description,
				created_at: storeInsertResult.created_at,
				updated_at: storeInsertResult.updated_at,
				created_user_id: storeInsertResult.created_user_id,
				updated_user_id: storeInsertResult.updated_user_id
			};

			await prisma.storeHistory.create({
				data: {
					store_id: storeInsertResult.id,
					name,
					address,
					description,
					updated_user_id: storeInsertResult.updated_user_id
				}
			});
		});

		status = 200;
	} catch (e) {
		console.error(e);
		status = getStatus(e);
	}

	return new Response(JSON.stringify(data), {
		status
	});
};
