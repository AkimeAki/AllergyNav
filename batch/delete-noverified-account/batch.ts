import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

void (async () => {
	try {
		let count = 0;

		await prisma.$transaction(async (prisma) => {
			const noVerifiedOver7DaysUsers = await prisma.user.findMany({
				select: {
					id: true,
					email: true
				},
				where: {
					created_at: {
						lt: sevenDaysAgo
					},
					deleted: false,
					verified: false
				}
			});

			for (const user of noVerifiedOver7DaysUsers) {
				const randam = user.email + "__noVerified__" + crypto.randomUUID();

				await prisma.user.updateMany({
					data: {
						verified: false,
						deleted: true,
						email: randam
					},
					where: {
						id: user.id
					}
				});

				await prisma.userRecoveryCode.deleteMany({
					where: {
						email: user.email
					}
				});

				await prisma.userVerifyCode.deleteMany({
					where: {
						user_id: user.id
					}
				});
			}

			count = noVerifiedOver7DaysUsers.length;
		});

		console.log(`delete acount: ${count}`);
	} catch (e) {
		console.error(e);
	}
})();
