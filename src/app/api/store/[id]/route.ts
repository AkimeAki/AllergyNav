import { ForbiddenError, TooManyRequestError, ValidationError } from "@/definition";
import { safeString } from "@/libs/safe-type";
import { isEmptyString } from "@/libs/check-string";
import { prisma } from "@/libs/prisma";
import type { EditStoreResponse, GetStoreResponse } from "@/type";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/libs/auth";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { accessCheck } from "@/libs/access-check";
import { getStatus } from "@/libs/get-status";

interface Data {
	params: {
		id: string;
	};
}

export const runtime = "edge";

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
				url: true,
				allergy_menu_url: true,
				tabelog_url: true,
				gurunavi_url: true,
				hotpepper_url: true,
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
		const url = isEmptyString(safeString(body.url) ?? "") ? null : safeString(body.url) ?? "";
		const allergyMenuUrl = isEmptyString(safeString(body.allergyMenuUrl) ?? "")
			? null
			: safeString(body.allergyMenuUrl) ?? "";
		const tabelogUrl = isEmptyString(safeString(body.tabelogUrl) ?? "") ? null : safeString(body.tabelogUrl) ?? "";
		const gurunaviUrl = isEmptyString(safeString(body.gurunaviUrl) ?? "")
			? null
			: safeString(body.gurunaviUrl) ?? "";
		const hotpepperUrl = isEmptyString(safeString(body.hotpepperUrl) ?? "")
			? null
			: safeString(body.hotpepperUrl) ?? "";
		const storeId = safeString(params.id);
		const userId = safeString(session?.user?.id);

		console.log(url);

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
					updated_user_id: userId,
					url,
					allergy_menu_url: allergyMenuUrl,
					tabelog_url: tabelogUrl,
					gurunavi_url: gurunaviUrl,
					hotpepper_url: hotpepperUrl
				}
			});

			data = {
				id: storeInsertResult.id,
				name: storeInsertResult.name,
				address: storeInsertResult.address,
				description: storeInsertResult.description,
				url: storeInsertResult.url,
				allergy_menu_url: storeInsertResult.allergy_menu_url,
				tabelog_url: storeInsertResult.tabelog_url,
				gurunavi_url: storeInsertResult.gurunavi_url,
				hotpepper_url: storeInsertResult.hotpepper_url,
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
					url,
					allergy_menu_url: allergyMenuUrl,
					tabelog_url: tabelogUrl,
					gurunavi_url: gurunaviUrl,
					hotpepper_url: hotpepperUrl,
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
