import { hashPass } from "@/libs/password";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const userData = [
	{
		email: "admin@example.com",
		password: "admin",
		role: "admin"
	},
	{
		email: "normal@example.com",
		password: "normal",
		role: "normal"
	}
];

// const allergenData = [
// 	{
// 		id: "egg",
// 		name: "卵"
// 	},
// 	{
// 		id: "milk",
// 		name: "乳製品"
// 	},
// 	{
// 		id: "wheat",
// 		name: "小麦"
// 	},
// 	{
// 		id: "shrimp",
// 		name: "エビ"
// 	},
// 	{
// 		id: "crab",
// 		name: "カニ"
// 	},
// 	{
// 		id: "soba",
// 		name: "そば"
// 	},
// 	{
// 		id: "peanut",
// 		name: "落花生"
// 	}
// ];

void prisma.$transaction(async (prisma) => {
	for (const user of userData) {
		await prisma.user.create({
			data: {
				email: user.email,
				password: await hashPass(user.password),
				role: user.role
			}
		});
	}
});

// void prisma.$transaction(async (prisma) => {
// 	for (const allergen of allergenData) {
// 		await prisma.allergen.create({
// 			data: {
// 				id: allergen.id,
// 				name: allergen.name
// 			}
// 		});
// 	}
// });
