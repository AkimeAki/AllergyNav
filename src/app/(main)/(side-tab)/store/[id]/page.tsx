import { css } from "@kuma-ui/core";
import GoogleMap from "@/components/molecules/GoogleMap";
import { formatText } from "@/libs/format-text";
import EditStoreButton from "@/components/organisms/EditStoreButton";
import { getStore } from "@/libs/server-fetch";
import SubTitle from "@/components/atoms/SubTitle";
import type { Metadata } from "next";
import { seoHead } from "@/libs/seo";
import StoreDetailIconLink from "@/components/molecules/StoreDetailIconLink";

interface Props {
	params: {
		id: string;
	};
}

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
	const storeDetail = await getStore(params.id);

	return seoHead({
		title: storeDetail.name,
		description: `『${storeDetail.name}』のアレルギー情報ページです。アレルギー情報を得た方、持っている方はアレルギーナビに情報を追加してくれると助かります。`
	});
};

export default async function ({ params }: Props): Promise<JSX.Element> {
	const storeDetail = await getStore(params.id);
	let linkCount = 0;
	let linkFirst = "";
	if (storeDetail.url !== null) {
		linkCount++;
		linkFirst = "url";
	}

	if (storeDetail.allergy_menu_url !== null) {
		linkCount++;
		if (linkFirst === "") {
			linkFirst = "allergy_menu_url";
		}
	}

	if (storeDetail.tabelog_url !== null) {
		linkCount++;
		if (linkFirst === "") {
			linkFirst = "tabelog_url";
		}
	}

	if (storeDetail.gurunavi_url !== null) {
		linkCount++;
		if (linkFirst === "") {
			linkFirst = "gurunavi_url";
		}
	}

	if (storeDetail.hotpepper_url !== null) {
		linkCount++;
		if (linkFirst === "") {
			linkFirst = "hotpepper_url";
		}
	}

	return (
		<div
			className={css`
				display: flex;
				flex-direction: column;
				gap: 30px;
				width: 100%;
			`}
		>
			<div
				className={css`
					display: table;
					border-top-left-radius: 7px;
					border-bottom-left-radius: 7px;
					overflow: hidden;
				`}
			>
				<table
					className={css`
						border-collapse: collapse;
						width: 100%;

						th,
						td {
							padding: 15px 10px;
							border-width: 2px;
							border-style: solid;
							border-color: var(--color-theme);

							@media (max-width: 600px) {
								font-size: 15px;

								* {
									font-size: inherit;
								}
							}
						}

						th {
							text-align: left;
							background-color: var(--color-theme);
							color: var(--color-secondary);
							font-weight: bold;
							padding-left: 20px;
							padding-right: 20px;
							width: 130px;
							user-select: none;
							pointer-events: none;

							@media (max-width: 600px) {
								width: 115px;
							}
						}
					`}
				>
					<tbody>
						<tr>
							<th>グループ</th>
							<td>（未実装）</td>
						</tr>
						<tr>
							<th>住所</th>
							<td>
								<StoreDetailIconLink
									href={`https://www.google.com/maps/search/${storeDetail.address} ${storeDetail.name}`}
									icon="/icons/google-map.svg"
									text={storeDetail.address}
								/>
							</td>
						</tr>
						{storeDetail.url !== null && (
							<tr>
								{linkFirst === "url" && <th rowSpan={linkCount}>各種リンク</th>}
								<td>
									<StoreDetailIconLink
										href={storeDetail.url}
										icon={`https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${storeDetail.url}&size=64`}
										text="公式サイト"
									/>
								</td>
							</tr>
						)}

						{storeDetail.allergy_menu_url !== null && (
							<tr>
								{linkFirst === "allergy_menu_url" && <th rowSpan={linkCount}>各種リンク</th>}
								<td>
									<StoreDetailIconLink
										href={storeDetail.allergy_menu_url}
										icon={`https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${storeDetail.allergy_menu_url}&size=64`}
										text="公式アレルギー成分表"
									/>
								</td>
							</tr>
						)}
						{storeDetail.tabelog_url !== null && (
							<tr>
								{linkFirst === "tabelog_url" && <th rowSpan={linkCount}>各種リンク</th>}
								<td>
									<StoreDetailIconLink
										href={storeDetail.tabelog_url}
										icon="/icons/tabelog.png"
										text="食べログ"
									/>
								</td>
							</tr>
						)}
						{storeDetail.gurunavi_url !== null && (
							<tr>
								{linkFirst === "gurunavi_url" && <th rowSpan={linkCount}>各種リンク</th>}
								<td>
									<StoreDetailIconLink
										href={storeDetail.gurunavi_url}
										icon="/icons/gurunavi.png"
										text="ぐるなび"
									/>
								</td>
							</tr>
						)}
						{storeDetail.hotpepper_url !== null && (
							<tr>
								{linkFirst === "hotpepper_url" && <th rowSpan={linkCount}>各種リンク</th>}
								<td>
									<StoreDetailIconLink
										href={storeDetail.hotpepper_url}
										icon="/icons/hotpepper.png"
										text="ホットペッパーグルメ"
									/>
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
			{storeDetail.description !== "" && (
				<div
					dangerouslySetInnerHTML={{
						__html: formatText(storeDetail.description)
					}}
				/>
			)}
			<div
				className={css`
					display: flex;
					flex-direction: column;
					gap: 25px;
				`}
			>
				<SubTitle>マップ</SubTitle>
				<GoogleMap search={`${storeDetail.address} ${storeDetail.name}`} />
			</div>
			<EditStoreButton storeId={storeDetail.id} />
		</div>
	);
}
