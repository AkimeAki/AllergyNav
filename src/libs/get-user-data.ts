import { nextAuthOptions } from "@/libs/auth";
import { getServerSession } from "next-auth";
import { safeString } from "@/libs/safe-type";
import { prisma } from "@/libs/prisma";

interface ReturnType {
	userId: string;
	email: string;
	role: string;
	isLogin: boolean;
	isVerified: boolean;
}

export const getUserData = async (): Promise<ReturnType> => {
	const session = await getServerSession(nextAuthOptions);
	const userId = safeString(session?.user?.id) ?? "";
	let role = "";
	let email = "";
	let isLogin = false;
	let isVerified = false;

	try {
		if (userId === "") {
			throw new Error();
		}

		const result = await prisma.user.findUniqueOrThrow({
			where: { id: userId }
		});

		role = result.role;
		email = result.email;
		isVerified = result.verified;

		if (userId !== "" && role !== "" && email !== "") {
			isLogin = true;
		}
	} catch (e) {
		/* empty */
	}

	return { userId, email, role, isLogin, isVerified };
};
