import { prisma } from "@/libs/prisma";

export const isAdminUser = async (userId: string): Promise<boolean> => {
	let admin = false;

	try {
		const userResult = await prisma.user.findFirstOrThrow({
			select: {
				role: true
			},
			where: {
				id: userId
			}
		});

		if (userResult.role === "admin") {
			admin = true;
		}
	} catch (e) {
		/* empty */
	}

	return admin;
};
