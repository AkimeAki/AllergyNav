import { prisma } from "@/libs/prisma";

export const isVerifiedUser = async (userId: string): Promise<boolean> => {
	let verified = false;

	try {
		const userResult = await prisma.user.findFirstOrThrow({
			select: {
				verified: true,
				deleted: true
			},
			where: {
				id: userId
			}
		});

		if (userResult.verified && !userResult.deleted) {
			verified = true;
		}
	} catch (e) {}

	return verified;
};
