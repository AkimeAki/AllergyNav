import type { GetAllergensResponse } from "@/type";
import type { NextRequest } from "next/server";
import { prisma } from "@/libs/prisma";
import { TooManyRequestError } from "@/definition";
import { accessCheck } from "@/libs/access-check";
import { getStatus } from "@/libs/get-status";

export const GET = async (req: NextRequest): Promise<Response> => {
	let data: GetAllergensResponse = null;
	let status = 500;

	try {
		if (!(await accessCheck(req))) {
			throw new TooManyRequestError();
		}

		const result = await prisma.allergen.findMany({
			select: {
				id: true,
				name: true
			}
		});

		data = [];
		for (const item of result) {
			data.push({
				id: item.id,
				name: item.name
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
