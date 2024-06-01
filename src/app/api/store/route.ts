import { ForbiddenError, TooManyRequestError, ValidationError } from "@/definition";
import type { AddStoreResponse, GetStoresResponse, StoreResponse } from "@/type";
import { safeNumber, safeString } from "@/libs/safe-type";
import { NextResponse, type NextRequest } from "next/server";
import { isEmptyString } from "@/libs/check-string";
import { prisma } from "@/libs/prisma";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/libs/auth";
import { getToken } from "next-auth/jwt";
import { accessCheck } from "@/libs/access-check";
import { getStatus } from "@/libs/get-status";
import { normalize } from "@geolonia/normalize-japanese-addresses";
import { calcDistance } from "@/libs/calc-distance";

const headers = {
	// "Access-Control-Allow-Origin": "http://localhost:10111", // 許可するオリジン
	"Access-Control-Allow-Methods": "GET, POST" // 許可するメソッド
};

export const GET = async (req: NextRequest): Promise<NextResponse> => {
	let data: GetStoresResponse = null;
	let status = 500;

	try {
		if (!(await accessCheck(req))) {
			throw new TooManyRequestError();
		}

		const { searchParams } = new URL(req.url);
		const allergens = (safeString(searchParams.get("allergens")) ?? "").split(",");
		const keywords = (safeString(searchParams.get("keywords")) ?? "").replaceAll(/\s/g, " ").split(" ");
		const area = !isEmptyString(safeString(searchParams.get("area")) ?? "")
			? safeString(searchParams.get("area")) ?? "all"
			: "all";
		const coords = safeString(searchParams.get("coords"));
		const radius = safeNumber(searchParams.get("radius"));

		const result = await prisma.store.findMany({
			select: {
				id: true,
				name: true,
				address: true,
				description: true,
				url: true,
				allergy_menu_url: true,
				tabelog_url: true,
				gurunavi_url: true,
				hotpepper_url: true,
				updated_at: true,
				created_at: true,
				created_user_id: true,
				updated_user_id: true,
				menus: {
					include: {
						menu_allergens: {
							select: {
								allergen_id: true,
								status: true
							}
						}
					}
				}
			},
			where: {
				OR: [
					{
						OR: keywords.map((keyword) => {
							return {
								name: {
									contains: keyword
								}
							};
						})
					},
					{
						OR: keywords.map((keyword) => {
							return {
								description: {
									contains: keyword
								}
							};
						})
					}
				]
			}
		});

		data = [];

		// アレルゲンフィルター
		for (const item of result) {
			// お店の全メニューの中にアレルゲンが含まれていなかったかどうかを管理する変数
			let menuAllergen = false;
			for (const menu of item.menus) {
				// メニューの中にアレルゲンが含まれているかどうかを管理する変数
				let allergen = false;
				const allergenIds = menu.menu_allergens
					.filter((allergen) => {
						return allergen.status === "contain";
					})
					.map((allergen) => {
						return allergen.allergen_id;
					});

				for (const allergenId of allergenIds) {
					if (allergens.includes(allergenId)) {
						allergen = true;
					}
				}

				// メニューの中にアレルゲンが含まれていたので次のメニューにスキップ
				if (allergen) {
					continue;
				}

				// ここまで処理が来れば、検索時のアレルゲンが含まれていないメニューが見つかったということ
				menuAllergen = true;
				continue;
			}

			if (item.menus.length === 0) {
				menuAllergen = true;
			}

			// メニューの中にアレルゲンが含まれていなかったらお店をレスポンスに追加
			if (menuAllergen) {
				const labels: StoreResponse["labels"] = [];
				if (item.allergy_menu_url !== null) {
					labels.push({
						id: "exist_official_allergy_menu_url",
						name: "公式成分表あり",
						locked: true
					});
				}

				data.push({
					id: item.id,
					name: item.name,
					address: item.address,
					description: item.description,
					url: item.url,
					allergy_menu_url: item.allergy_menu_url,
					tabelog_url: item.tabelog_url,
					gurunavi_url: item.gurunavi_url,
					hotpepper_url: item.hotpepper_url,
					updated_at: item.updated_at,
					created_at: item.created_at,
					created_user_id: item.created_user_id,
					updated_user_id: item.updated_user_id,
					labels
				});
			}
		}

		// 現在位置情報検索フィルター
		if (area === "location" && coords !== null && radius !== null) {
			const filterData = [];
			for (const item of data) {
				const addressNormalizeResult = await normalize(item.address);
				const latitude = safeNumber(coords.split(",")[0]);
				const longitude = safeNumber(coords.split(",")[1]);

				if (
					addressNormalizeResult.lat !== null &&
					addressNormalizeResult.lng !== null &&
					latitude !== null &&
					longitude !== null
				) {
					const distance = calcDistance(
						longitude,
						latitude,
						addressNormalizeResult.lng,
						addressNormalizeResult.lat
					);

					if (distance <= radius) {
						filterData.push(item);
					}
				}
			}

			data = filterData;
		}

		status = 200;
	} catch (e) {
		console.error(e);
		data = null;

		status = getStatus(e);
	}

	return NextResponse.json(data, { status, headers });
};

export const POST = async (req: NextRequest): Promise<Response> => {
	let status = 500;
	let data: AddStoreResponse = null;

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

		const name = safeString(body.name);
		const address = safeString(body.address);
		const description = safeString(body.description);
		const url = isEmptyString(safeString(body.url) ?? "") ? null : safeString(body.url) ?? "";
		const allergyMenuUrl = isEmptyString(safeString(body.allergyMenuUrl) ?? "")
			? null
			: safeString(body.allergyMenuUrl) ?? "";
		const tabelogUrl = isEmptyString(safeString(body.tabelogUrl) ?? "") ? null : safeString(body.tabelogUrl) ?? "";
		const gurunaviUrl = isEmptyString(safeString(body.gurunaviUrl) ?? "")
			? null
			: safeString(body.gurunaviUrl) ?? "";
		const hotpepperUrl = isEmptyString(safeString(body.hotpepperUrl) ?? "")
			? null
			: safeString(body.hotpepperUrl) ?? "";
		const userId = safeString(session?.user?.id);

		if (name === null || address === null || description === null) {
			throw new ValidationError();
		}

		if (userId === null) {
			throw new ForbiddenError();
		}

		if (isEmptyString(name)) {
			throw new ValidationError();
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

		await prisma.$transaction(async (prisma) => {
			const storeInsertResult = await prisma.store.create({
				data: {
					name,
					address,
					description,
					created_user_id: userId,
					updated_user_id: userId,
					url,
					allergy_menu_url: allergyMenuUrl,
					tabelog_url: tabelogUrl,
					gurunavi_url: gurunaviUrl,
					hotpepper_url: hotpepperUrl
				}
			});

			const labels: StoreResponse["labels"] = [];
			if (storeInsertResult.allergy_menu_url !== null) {
				labels.push({
					id: "exist_official_allergy_menu_url",
					name: "公式成分表あり",
					locked: true
				});
			}

			data = {
				id: storeInsertResult.id,
				name: storeInsertResult.name,
				address: storeInsertResult.address,
				description: storeInsertResult.description,
				url: storeInsertResult.url,
				allergy_menu_url: storeInsertResult.allergy_menu_url,
				tabelog_url: storeInsertResult.tabelog_url,
				gurunavi_url: storeInsertResult.gurunavi_url,
				hotpepper_url: storeInsertResult.hotpepper_url,
				created_at: storeInsertResult.created_at,
				updated_at: storeInsertResult.updated_at,
				created_user_id: storeInsertResult.created_user_id,
				updated_user_id: storeInsertResult.updated_user_id,
				labels
			};

			await prisma.storeHistory.create({
				data: {
					store_id: storeInsertResult.id,
					name,
					address,
					description,
					url,
					allergy_menu_url: allergyMenuUrl,
					tabelog_url: tabelogUrl,
					gurunavi_url: gurunaviUrl,
					hotpepper_url: hotpepperUrl,
					updated_user_id: storeInsertResult.updated_user_id
				}
			});
		});

		status = 200;
	} catch (e) {
		console.error(e);
		data = null;

		status = getStatus(e);
	}

	return NextResponse.json(data, { status, headers });
};
