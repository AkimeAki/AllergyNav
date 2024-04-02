import { ForbiddenError, NotFoundError, ValidationError } from "@/definition";
import { safeNumber } from "@/libs/safe-type";
import type { GetUserResponse } from "@/type";
import { prisma } from "@/libs/prisma";
import type { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/route";
import { getToken } from "next-auth/jwt";

interface Data {
	params: {
		id: string;
	};
}

export const GET = async (req: NextRequest, { params }: Data): Promise<Response> => {
	let status = 500;
	let data: GetUserResponse = null;

	try {
		const userId = safeNumber(params.id);

		if (userId === null) {
			throw new ValidationError();
		}

		const session = await getServerSession(nextAuthOptions);
		const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

		const authenticated = session !== null && token !== null && userId === safeNumber(session.user?.id);

		const result = await prisma.user.findUniqueOrThrow({
			where: { id: userId }
		});

		data = {
			id: result.id,
			email: authenticated ? result.email : 403,
			role: authenticated ? result.role : 403
		};

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
