import { PrismaClient } from "@prisma/client";

declare global {
	// eslint-disable-next-line no-var
	var prisma: PrismaClient | undefined;
}

// globalにprismaが既に定義されていればnewする
export const prisma = global.prisma ?? new PrismaClient();
global.prisma = prisma;
