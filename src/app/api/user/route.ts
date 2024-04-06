import { NotFoundError, ValidationError } from "@/definition";
import { safeString } from "@/libs/safe-type";
import { isEmailString, isEmptyString } from "@/libs/check-string";
import { prisma } from "@/libs/prisma";
import type { AddUserResponse } from "@/type";
import { hashPass } from "@/libs/password";

export const POST = async (req: Request): Promise<Response> => {
	let status = 500;
	let data: AddUserResponse = null;

	try {
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
