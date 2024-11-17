import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

void (async () => {
	try {
		await prisma.userRecoveryCode.deleteMany({
			where: {
				created_at: {
					lt: sevenDaysAgo
				}
			}
		});
	} catch (e) {
		console.error(e);
	}
})();
