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
				created_at: true,
				updated_at: true
			},
			where: {
				deleted: false,
				store_id: storeId ?? undefined
			}
		});

		data = [];
		for (const item of result) {
			data.push({
				id: item.id,
				url: item.url,
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
		const descrition = safeString(body.description);
		const pictureBuffer = safeString(body.arrayBuffer);

		if (descrition === null || pictureBuffer === null || storeId === null) {
			throw new ValidationError();
		}

		if (userId === null) {
			throw new ForbiddenError();
		}

		const userResult = await prisma.user.findFirstOrThrow({
			select: {
				verified: true
			},
			where: {
				id: userId
			}
		});

		if (!userResult.verified) {
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
				.resize(1280, 1280, {
					fit: "inside"
				})
				.rotate()
				.withMetadata()
				.jpeg()
				.toBuffer();

			const filename = `${createId()}.jpg`;

			const addPictureResult = await prisma.picture.create({
				data: {
					url: `https://files.allergy-navi.com/${filename}`,
					store_id: storeId,
					menu_picture:
						menuId === null
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
