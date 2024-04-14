import { ForbiddenError, TooManyRequestError, ValidationError } from "@/definition";
import type { EditMenuResponse, GetMenuResponse } from "@/type";
import { safeString } from "@/libs/safe-type";
import { isEmptyString } from "@/libs/check-string";
import { prisma } from "@/libs/prisma";
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

export const GET = async (req: NextRequest, { params }: Data): Promise<Response> => {
	let status = 500;
	let data: GetMenuResponse = null;

	try {
		if (!(await accessCheck(req))) {
			throw new TooManyRequestError();
		}

		const menuId = safeString(params.id);

		if (menuId === null) {
			throw new ValidationError();
		}

		const result = await prisma.menu.findUniqueOrThrow({
			where: { id: menuId },
			select: {
				id: true,
				name: true,
				store_id: true,
				description: true,
				updated_at: true,
				created_at: true,
				created_user_id: true,
				updated_user_id: true,
				menu_allergens: true
			}
		});

		const allergensResult = await prisma.allergen.findMany({
			select: {
				id: true,
				name: true
			}
		});

		data = {
			id: result.id,
			name: result.name,
			store_id: result.store_id,
			description: result.description,
			updated_at: result.updated_at,
			created_at: result.created_at,
			created_user_id: result.created_user_id,
			updated_user_id: result.updated_user_id,
			allergens: result.menu_allergens.map((allergen) => {
				let allergenName = "";
				allergensResult.forEach((item) => {
					if (item.id === allergen.allergen_id) {
						allergenName = item.name;
					}
				});

				return {
					id: allergen.allergen_id,
					name: allergenName
				};
			})
		};

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

export const PUT = async (req: NextRequest, { params }: Data): Promise<Response> => {
	let status = 500;
	let data: EditMenuResponse = null;

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
		const description = safeString(body.description);
		const menuId = safeString(params.id);
		const userId = safeString(session?.user?.id);

		if (name === null || allergens === null || menuId === null || description === null) {
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

		await prisma.$transaction(async (prisma): Promise<void> => {
			const menuUpdateResult = await prisma.menu.update({
				data: {
					name,
					description,
					updated_user_id: userId
				},
				where: {
					id: menuId
				}
			});

			// 前のアレルゲンとの連携を削除
			await prisma.menuAllergen.deleteMany({
				where: {
					menu_id: menuId
				}
			});

			const menuAllergenInsertResult = [];
			for (const allergen of JSON.parse(allergens) as string[]) {
				const result = await prisma.menuAllergen.create({
					data: {
						allergen_id: allergen,
						menu_id: menuUpdateResult.id
					}
				});

				menuAllergenInsertResult.push(result);
			}

			const allergensResult = await prisma.allergen.findMany({
				select: {
					id: true,
					name: true
				}
			});

			data = {
				id: menuUpdateResult.id,
				name: menuUpdateResult.name,
				store_id: menuUpdateResult.store_id,
				description: menuUpdateResult.description,
				created_at: menuUpdateResult.created_at,
				updated_at: menuUpdateResult.updated_at,
				created_user_id: menuUpdateResult.created_user_id,
				updated_user_id: menuUpdateResult.updated_user_id,
				allergens: menuAllergenInsertResult.map((allergen) => {
					let allergenName = "";
					allergensResult.forEach((item) => {
						if (item.id === allergen.allergen_id) {
							allergenName = item.name;
						}
					});

					return {
						id: allergen.allergen_id,
						name: allergenName
					};
				})
			};

			const menuHistoryInsertResult = await prisma.menuHistory.create({
				data: {
					name,
					store_id: menuUpdateResult.store_id,
					menu_id: menuUpdateResult.id,
					description,
					updated_user_id: menuUpdateResult.updated_user_id
				}
			});

			for (const allergen of JSON.parse(allergens) as string[]) {
				await prisma.menuAllergenHistory.create({
					data: {
						allergen_id: allergen,
						menu_id: menuId,
						menu_history_id: menuHistoryInsertResult.id
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
