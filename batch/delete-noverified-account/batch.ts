import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

void (async () => {
	try {
		const result = await prisma.user.updateMany({
			data: {
				verified: false,
				deleted: true,
				email: crypto.randomUUID()
			},
			where: {
				created_at: {
					lt: sevenDaysAgo
				},
				deleted: false
			}
		});

		console.log(`delete acount: ${result.count}`);
	} catch (e) {
		console.error(e);
	}
})();
