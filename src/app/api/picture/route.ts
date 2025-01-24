import { ForbiddenError, TooManyRequestError, ValidationError } from "@/definition";
import type { AddPictureResponse, GetPicturesResponse } from "@/type";
import { safeString } from "@/libs/safe-type";
import { prisma } from "@/libs/prisma";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/libs/auth";
import { getToken } from "next-auth/jwt";
import { accessCheck } from "@/libs/access-check";
import { getStatus } from "@/libs/get-status";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { createId } from "@paralleldrive/cuid2";
import sharp from "sharp";
import { isVerifiedUser } from "@/libs/check-verified-user";

export const GET = async (req: NextRequest): Promise<NextResponse> => {
	let status = 500;
	let data: GetPicturesResponse = null;

	try {
		if (!(await accessCheck(req))) {
			throw new TooManyRequestError();
		}

		const { searchParams } = new URL(req.url);
		const storeId = safeString(searchParams.get("storeId"));

		const result = await prisma.picture.findMany({
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
				deleted: false,
				OR:
					storeId === null
						? undefined
						: storeId.split(",").map((id) => {
								return {
									store_id: id
								};
							})
			}
		});

		data = [];
		for (const item of result) {
			data.push({
				id: item.id,
				url: item.url,
				description: item.description,
				store_id: item.store_id,
				menu_id: item.menu_picture?.menu_id,
				updated_at: item.updated_at,
				created_at: item.created_at
			});
		}

		status = 200;
	} catch (e) {
		console.error(e);
		data = null;

		status = getStatus(e);
	}

	return NextResponse.json(data, { status });
};

export const POST = async (req: NextRequest): Promise<NextResponse> => {
	let status = 500;
	let data: AddPictureResponse = null;

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
		const storeId = safeString(body.storeId);
		const menuId = safeString(body.menuId);
		const description = safeString(body.description);
		const pictureBuffer = safeString(body.arrayBuffer);
		const filesHostname = safeString(process.env.FILES_HOSTNAME);

		if (filesHostname === null) {
			throw new Error();
		}

		if (description === null || pictureBuffer === null || storeId === null) {
			throw new ValidationError();
		}

		if (userId === null) {
			throw new ForbiddenError();
		}

		if (!(await isVerifiedUser(userId))) {
			throw new ForbiddenError();
		}

		await prisma.$transaction(async (prisma): Promise<void> => {
			const S3 = new S3Client({
				region: "auto",
				endpoint: process.env.R2_ENDPOINT ?? "",
				credentials: {
					accessKeyId: process.env.R2_ACCESS_KEY_ID ?? "",
					secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? ""
				}
			});

			const buffer = Buffer.from(JSON.parse(pictureBuffer));
			const formattedBuffer = await sharp(buffer)
				.resize(600, 600, {
					fit: "inside"
				})
				.rotate()
				.withMetadata()
				.webp({
					quality: 60,
					effort: 6
				})
				.toBuffer();

			const filename = `${createId()}.webp`;

			const addPictureResult = await prisma.picture.create({
				data: {
					url: `https://${filesHostname}/${filename}`,
					description,
					store_id: storeId,
					created_user_id: userId,
					updated_user_id: userId,
					menu_picture:
						menuId === null || menuId === "null"
							? undefined
							: {
									create: { menu_id: menuId }
								}
				}
			});

			await S3.send(
				new PutObjectCommand({
					Body: formattedBuffer,
					Bucket: process.env.R2_BUCKET,
					Key: filename,
					ContentType: "image/jpeg"
				})
			);

			data = {
				id: addPictureResult.id,
				url: addPictureResult.url,
				description: addPictureResult.description,
				store_id: addPictureResult.store_id,
				menu_id: menuId === null || menuId === "null" ? undefined : menuId,
				updated_at: addPictureResult.updated_at,
				created_at: addPictureResult.created_at
			};
		});

		status = 200;
	} catch (e) {
		data = null;
		console.error(e);

		status = getStatus(e);
	}

	return NextResponse.json(data, { status });
};
