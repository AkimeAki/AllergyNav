import { ForbiddenError, TooManyRequestError, ValidationError } from "@/definition";
import type { AddMenuResponse, AllergenStatusValue, GetMenusResponse } from "@/type";
import { safeString } from "@/libs/safe-type";
import { isEmptyString } from "@/libs/check-string";
import { prisma } from "@/libs/prisma";
import type { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/libs/auth";
import { getToken } from "next-auth/jwt";
import { accessCheck } from "@/libs/access-check";
import { getStatus } from "@/libs/get-status";

export const GET = async (req: NextRequest): Promise<Response> => {
	let status = 500;
	let data: GetMenusResponse = null;

	try {
		if (!(await accessCheck(req))) {
			throw new TooManyRequestError();
		}

		const { searchParams } = new URL(req.url);
		const storeId = safeString(searchParams.get("storeId"));

		const result = await prisma.menu.findMany({
			select: {
				id: true,
				name: true,
				store_id: true,
				description: true,
				updated_at: true,
				created_at: true,
				menu_allergens: true,
				created_user_id: true,
				updated_user_id: true
			},
			where: {
				deleted: false,
				store_id: storeId ?? undefined
			}
		});

		const allergensResult = await prisma.allergen.findMany({
			select: {
				id: true,
				name: true
			}
		});

		data = [];

		for (const item of result) {
			const allergenStatus: Record<string, AllergenStatusValue> = {};
			allergensResult.forEach((allergen) => {
				allergenStatus[allergen.id] = "unkown";
			});

			item.menu_allergens.forEach((allergen) => {
				allergenStatus[allergen.allergen_id] = allergen.status as AllergenStatusValue;
			});

			data.push({
				id: item.id,
				name: item.name,
				store_id: item.store_id,
				description: item.description,
				updated_at: item.updated_at,
				created_at: item.created_at,
				allergens: allergenStatus,
				created_user_id: item.created_user_id,
				updated_user_id: item.updated_user_id
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

export const POST = async (req: NextRequest): Promise<Response> => {
	let status = 500;
	let data: AddMenuResponse = null;

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

		const name = safeString(body.name);
		const allergens = safeString(body.allergens);
		const storeId = safeString(body.storeId);
		const description = safeString(body.description);
		const userId = safeString(session?.user?.id);

		if (name === null || description === null || allergens === null) {
			throw new ValidationError();
		}

		if (userId === null) {
			throw new ForbiddenError();
		}

		if (isEmptyString(name)) {
			throw new ValidationError();
		}

		if (storeId === null) {
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

		await prisma.$transaction(async (prisma): Promise<void> => {
			const menuInsertResult = await prisma.menu.create({
				data: {
					name,
					store_id: storeId,
					description,
					created_user_id: userId,
					updated_user_id: userId
				}
			});

			const allergenStatus = JSON.parse(allergens) as Record<string, AllergenStatusValue>;
			for (const allergen in allergenStatus) {
				if (allergenStatus[allergen] === "not contained") {
					break;
				}

				await prisma.menuAllergen.create({
					data: {
						allergen_id: allergen,
						menu_id: menuInsertResult.id,
						status: allergenStatus[allergen]
					}
				});
			}

			data = {
				id: menuInsertResult.id,
				name: menuInsertResult.name,
				store_id: menuInsertResult.store_id,
				description: menuInsertResult.description,
				created_at: menuInsertResult.created_at,
				updated_at: menuInsertResult.updated_at,
				created_user_id: menuInsertResult.created_user_id,
				updated_user_id: menuInsertResult.updated_user_id,
				allergens: allergenStatus
			};

			const menuHistoryInsertResult = await prisma.menuHistory.create({
				data: {
					name,
					store_id: storeId,
					menu_id: menuInsertResult.id,
					description,
					updated_user_id: menuInsertResult.updated_user_id
				}
			});

			console.log(allergenStatus);

			for (const allergen in allergenStatus) {
				if (allergenStatus[allergen] === "not contained") {
					break;
				}

				await prisma.menuAllergenHistory.create({
					data: {
						allergen_id: allergen,
						menu_id: menuInsertResult.id,
						menu_history_id: menuHistoryInsertResult.id,
						status: allergenStatus[allergen]
					}
				});
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
