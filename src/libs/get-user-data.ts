import { nextAuthOptions } from "@/libs/auth";
import { getServerSession } from "next-auth";
import { safeString } from "@/libs/safe-type";
import { prisma } from "@/libs/prisma";

interface ReturnType {
	userId: string | null;
	email: string | null;
	role: string | null;
}

export const getUserData = async (): Promise<ReturnType> => {
	const session = await getServerSession(nextAuthOptions);
	const userId = safeString(session?.user?.id);
	let role = null;
	let email = null;

	try {
		if (userId === null) {
			throw new Error();
		}

		const result = await prisma.user.findUniqueOrThrow({
			where: { id: userId }
		});

		role = safeString(result.role);
		email = safeString(result.email);
	} catch (e) {}

	return { userId, email, role };
};
