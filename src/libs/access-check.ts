import type { NextRequest } from "next/server";
import { safeString } from "@/libs/safe-type";
import { prisma } from "@/libs/prisma";

export const accessCheck = async (req: NextRequest): Promise<boolean> => {
	let error = true;

	try {
		let ip = safeString(req.headers.get("x-forwarded-for"));
		const path = safeString(req.nextUrl.pathname);
		if (ip === null) {
			if (process.env.NODE_ENV === "production") {
				throw new Error();
			} else {
				ip = "dummy";
			}
		}

		if (path === null) {
			throw new Error();
		}

		const oldAccessResult = await prisma.accessIp.findUnique({
			where: {
				ip_path: {
					ip,
					path
				}
			},
			select: {
				ip: true,
				path: true,
				count: true,
				updated_at: true,
				block: true
			}
		});

		if (oldAccessResult === null) {
			await prisma.accessIp.create({
				data: {
					ip,
					path,
					count: 1
				}
			});
		} else {
			const updatedAt = new Date(oldAccessResult.updated_at).getTime() / 1000;
			const now = new Date().getTime() / 1000;

			if (oldAccessResult.block && now - updatedAt <= 5 * 60) {
				throw new Error();
			}

			let count = oldAccessResult.count + 1;
			if (oldAccessResult.count >= 10 && now - updatedAt <= 3) {
				await prisma.accessIp.update({
					where: {
						ip_path: {
							ip,
							path
						}
					},
					data: {
						block: true
					}
				});

				throw new Error();
			}

			if (now - updatedAt > 3) {
				count = 1;
			}

			await prisma.accessIp.update({
				where: {
					ip_path: {
						ip,
						path
					}
				},
				data: {
					count
				}
			});
		}

		error = false;
	} catch (e) {}

	if (error) {
		return false;
	}

	return true;
};
