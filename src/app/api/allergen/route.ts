import type { GetAllergensResponse } from "@/type";
import type { NextRequest } from "next/server";
import { prisma } from "@/libs/prisma";
import { NotFoundError, ValidationError } from "@/definition";

export const GET = async (req: NextRequest): Promise<Response> => {
	let data: GetAllergensResponse = null;
	let status = 500;

	try {
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
