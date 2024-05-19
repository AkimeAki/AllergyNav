import { TooManyRequestError, ValidationError } from "@/definition";
import { safeString } from "@/libs/safe-type";
import type { GetUserResponse } from "@/type";
import { prisma } from "@/libs/prisma";
import type { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/libs/auth";
import { getToken } from "next-auth/jwt";
import { accessCheck } from "@/libs/access-check";
import { getStatus } from "@/libs/get-status";

interface Data {
	params: {
		id: string;
	};
}

export const runtime = "edge"

export const GET = async (req: NextRequest, { params }: Data): Promise<Response> => {
	let status = 500;
	let data: GetUserResponse = null;

	try {
		const userId = safeString(params.id);

		if (userId === null) {
			throw new ValidationError();
		}

		const session = await getServerSession(nextAuthOptions);
		const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

		const authenticated = session !== null && token !== null && userId === safeString(session.user?.id);

		if (!authenticated) {
			if (!(await accessCheck(req))) {
				throw new TooManyRequestError();
			}
		}

		const result = await prisma.user.findUniqueOrThrow({
			where: { id: userId }
		});

		data = {
			id: result.id.toString(),
			email: authenticated ? result.email : 403,
			role: authenticated ? result.role : 403,
			verified: authenticated ? result.verified : 403
		};

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
