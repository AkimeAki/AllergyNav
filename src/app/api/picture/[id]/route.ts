import { ForbiddenError, TooManyRequestError, ValidationError } from "@/definition";
import type { GetPictureResponse, EditPictureResponse } from "@/type";
import { safeString } from "@/libs/safe-type";
import { prisma } from "@/libs/prisma";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { accessCheck } from "@/libs/access-check";
import { getStatus } from "@/libs/get-status";
import { nextAuthOptions } from "@/libs/auth";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";

interface Data {
	params: {
		id: string;
	};
}

export const GET = async (req: NextRequest, { params }: Data): Promise<NextResponse> => {
	let status = 500;
	let data: GetPictureResponse = null;

	try {
		if (!(await accessCheck(req))) {
			throw new TooManyRequestError();
		}

		const pictureId = safeString(params.id);

		if (pictureId === null) {
			throw new ValidationError();
		}

		const result = await prisma.picture.findUniqueOrThrow({
			select: {
				id: true,
				url: true,
				store_id: true,
				description: true,
				created_at: true,
				updated_at: true,
				menu_picture: true
			},
			where: {
				id: pictureId
			}
		});

		data = {
			id: result.id,
			url: result.url,
			description: result.description,
			store_id: result.store_id,
			menu_id: result.menu_picture?.menu_id,
			updated_at: result.updated_at,
			created_at: result.created_at
		};

		status = 200;
	} catch (e) {
		console.error(e);
		data = null;

		status = getStatus(e);
	}

	return NextResponse.json(data, { status });
};

export const PUT = async (req: NextRequest, { params }: Data): Promise<NextResponse> => {
	let status = 500;
	let data: EditPictureResponse = null;

	const session = await getServerSession(nextAuthOptions);
	const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

	try {
		if (!(await accessCheck(req))) {
			throw new TooManyRequestError();
		}

		if (session === null || token === null) {
			throw new ForbiddenError();
		}

		const body = await req.json();

		const userId = safeString(session?.user?.id);
		const pictureId = safeString(params.id);
		const menuId = safeString(body.menuId);
		const description = safeString(body.description);

		if (userId === null) {
			throw new ForbiddenError();
		}

		if (description === null || pictureId === null) {
			throw new ValidationError();
		}

		await prisma.$transaction(async (prisma) => {
			const result = await prisma.picture.update({
				data: {
					description,
					updated_user_id: userId
				},
				where: {
					id: pictureId
				}
			});

			await prisma.menuPicture.deleteMany({
				where: {
					id: pictureId
				}
			});

			let insertMenuPictureResult:
				| {
						id: string;
						menu_id: string;
				  }
				| undefined = undefined;

			if (menuId !== null && menuId !== "null") {
				insertMenuPictureResult = await prisma.menuPicture.create({
					data: {
						id: pictureId,
						menu_id: menuId
					}
				});
			}

			data = {
				id: result.id,
				url: result.url,
				description: result.description,
				store_id: result.store_id,
				menu_id: insertMenuPictureResult?.menu_id,
				updated_at: result.updated_at,
				created_at: result.created_at
			};
		});

		status = 200;
	} catch (e) {
		console.error(e);
		data = null;

		status = getStatus(e);
	}

	return NextResponse.json(data, { status });
};
