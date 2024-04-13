import { TooManyRequestError, ValidationError } from "@/definition";
import { safeString } from "@/libs/safe-type";
import type { GetMenuHistoryResponse } from "@/type";
import type { NextRequest } from "next/server";
import { prisma } from "@/libs/prisma";
import { accessCheck } from "@/libs/access-check";
import { getStatus } from "@/libs/get-status";

interface Data {
	params: {
		id: string;
	};
}

export const GET = async (req: NextRequest, { params }: Data): Promise<Response> => {
	let status = 500;
	let data: GetMenuHistoryResponse = null;

	try {
		if (!(await accessCheck(req))) {
			throw new TooManyRequestError();
		}

		const menuId = safeString(params.id);

		if (menuId === null) {
			throw new ValidationError();
		}

		const result = await prisma.menuHistory.findMany({
			select: {
				id: true,
				name: true,
				store_id: true,
				description: true,
				created_at: true,
				menu_allergen_histories: true,
				updated_user_id: true
			},
			where: {
				menu_id: menuId
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
			data.push({
				id: item.id,
				name: item.name,
				store_id: item.store_id,
				description: item.description,
				created_at: item.created_at,
				allergens: item.menu_allergen_histories.map((allergen) => {
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
				}),
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
