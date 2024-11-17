import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

void (async () => {
	try {
		const result = await prisma.userVerifyCode.deleteMany({
			where: {
				created_at: {
					lt: sevenDaysAgo
				}
			}
		});

		console.log(`delete code: ${result.count}`);
	} catch (e) {
		console.error(e);
	}
})();
