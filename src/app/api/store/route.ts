import { ForbiddenError, NotFoundError, ValidationError } from "@/definition";
import type { AddStoreResponse, GetStoresResponse } from "@/type";
import { safeNumber, safeString } from "@/libs/safe-type";
import type { NextRequest } from "next/server";
import { isEmptyString } from "@/libs/check-string";
import { prisma } from "@/libs/prisma";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/route";
import { getToken } from "next-auth/jwt";

export const GET = async (req: NextRequest): Promise<Response> => {
	let data: GetStoresResponse = null;
	let status = 500;

	try {
		// const { searchParams } = new URL(req.url);
		// const allergens = safeString(searchParams.get("allergens"));
		// const keywords = safeString(searchParams.get("keywords"));

		const result = await prisma.store.findMany({
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

		data = [];
		for (const item of result) {
			data.push({
				id: item.id,
				name: item.name,
				address: item.address,
				description: item.description,
				updated_at: item.updated_at,
				created_at: item.created_at,
				created_user_id: item.created_user_id,
				updated_user_id: item.updated_user_id
			});
		}

		status = 200;
	} catch (e) {
		data = null;

		if (e instanceof NotFoundError) {
			status = 404;
		} else if (e instanceof ValidationError) {
			status = 422;
		}
	}

	return new Response(JSON.stringify(data), {
		status
	});
};

export const POST = async (req: NextRequest): Promise<Response> => {
	let status = 500;
	let data: AddStoreResponse = null;

	const session = await getServerSession(nextAuthOptions);
	const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

	try {
		if (session === null || token === null) {
			throw new ForbiddenError();
		}

		const body = await req.json();

		const name = safeString(body.name);
		const address = safeString(body.address);
		const description = safeString(body.description);
		const userId = safeNumber(session?.user?.id);

		if (name === null || address === null || description === null) {
			throw new ValidationError();
		}

		if (userId === null) {
			throw new ForbiddenError();
		}

		if (isEmptyString(name)) {
			throw new ValidationError();
		}

		await prisma.$transaction(async (prisma) => {
			const storeInsertResult = await prisma.store.create({
				data: {
					name,
					address,
					description,
					created_user_id: userId,
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
		data = null;

		if (e instanceof NotFoundError) {
			status = 404;
		} else if (e instanceof ValidationError) {
			status = 422;
		} else if (e instanceof ForbiddenError) {
			status = 403;
		}
	}

	return new Response(JSON.stringify(data), {
		status
	});
};
