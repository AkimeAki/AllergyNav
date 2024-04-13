import { TooManyRequestError, ValidationError } from "@/definition";
import { safeString } from "@/libs/safe-type";
import { isEmailString, isEmptyString } from "@/libs/check-string";
import { prisma } from "@/libs/prisma";
import type { AddUserResponse } from "@/type";
import { hashPass } from "@/libs/password";
import { accessCheck } from "@/libs/access-check";
import type { NextRequest } from "next/server";
import { getStatus } from "@/libs/get-status";

export const POST = async (req: NextRequest): Promise<Response> => {
	let status = 500;
	let data: AddUserResponse = null;

	try {
		if (!(await accessCheck(req))) {
			throw new TooManyRequestError();
		}

		const body = await req.json();

		const email = safeString(body.email);
		const password = safeString(body.password);

		if (email === null || password === null) {
			throw new ValidationError();
		}

		if (isEmptyString(email) || isEmptyString(password)) {
			throw new ValidationError();
		}

		if (!isEmailString(email)) {
			throw new ValidationError();
		}

		const result = await prisma.user.create({
			data: {
				email,
				password: await hashPass(password)
			}
		});

		data = {
			id: result.id.toString(),
			email: result.email
		};

		status = 200;
	} catch (e) {
		console.error(e);

		status = getStatus(e);
	}

	return new Response(JSON.stringify(data), {
		status
	});
};
