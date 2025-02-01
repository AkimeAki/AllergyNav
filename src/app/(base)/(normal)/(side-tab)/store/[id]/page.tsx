import { css } from "@kuma-ui/core";
import GoogleMap from "@/components/atoms/GoogleMap";
import { formatText } from "@/libs/format-text";
import EditStoreButton from "@/components/organisms/EditStoreButton";
import { serverApiFetch } from "@/libs/server-fetch";
import SubTitle from "@/components/atoms/SubTitle";
import type { Metadata } from "next";
import { seoHead } from "@/libs/seo";
import StoreDetailIconLink from "@/components/molecules/StoreDetailIconLink";
import JsonLD from "@/components/atoms/JsonLD";
import { siteTitle, siteUrl } from "@/definition";
import { GetStoreResponse } from "@/type";
import { notFound } from "next/navigation";
import HeaderItemArea from "@/components/organisms/HeaderItemArea";

interface Props {
	params: {
		id: string;
	};
}

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
	const storeDetail = await serverApiFetch<GetStoreResponse>(`/store/${params.id}`);

	if (storeDetail === null) {
		notFound();
	}

	return seoHead({
		title: storeDetail.name,
		description: `『${storeDetail.name}』のアレルギー情報ページです。アレルギー情報を得た方、持っている方はアレルギーナビに情報を追加してくれると助かります。`,
		canonicalPath: `/store/${storeDetail.id}`
	});
};

export default async function ({ params }: Props): Promise<JSX.Element> {
	const storeDetail = await serverApiFetch<GetStoreResponse>(`/store/${params.id}`);

	if (storeDetail === null) {
		notFound();
	}

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
		<>
			<JsonLD
				jsonld={[
					{
						"@context": "http://schema.org",
						"@type": "BreadcrumbList",
						name: "パンくずリスト",
						itemListElement: [
							{
								"@type": "ListItem",
								position: 1,
								item: {
									"@id": siteUrl,
									name: siteTitle
								}
							},
							{
								"@type": "ListItem",
								position: 2,
								item: {
									"@id": `${siteUrl}/store`,
									name: "お店"
								}
							},
							{
								"@type": "ListItem",
								position: 3,
								item: {
									"@id": `${siteUrl}/store/${storeDetail.id}`,
									name: storeDetail.name
								}
							}
						]
					}
				]}
			/>
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
								white-space: nowrap;

								@media (max-width: 600px) {
									width: 115px;
								}
							}
						`}
					>
						<tbody>
							<tr>
								<th>住所</th>
								<td>
									<StoreDetailIconLink
										href={`https://www.google.com/maps/search/${storeDetail.address} ${storeDetail.name}`}
										icon={`https://${process.env.FILES_HOSTNAME}/icons/google-map.svg`}
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
											icon={`https://${process.env.FILES_HOSTNAME}/icons/tabelog.png`}
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
											icon={`https://${process.env.FILES_HOSTNAME}/icons/gurunavi.png`}
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
											icon={`https://${process.env.FILES_HOSTNAME}/icons/hotpepper.png`}
											text="ホットペッパーグルメ"
										/>
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
				{storeDetail.labels.length !== 0 && (
					<div
						className={css`
							display: flex;
							flex-wrap: wrap;
							align-items: flex-start;
						`}
					>
						{storeDetail.labels.map((label) => (
							<div
								key={label.id}
								className={[
									css`
										font-size: 13px;
										border: 2px solid var(--color-theme-thin);
										border-radius: 8px;
										background-color: var(--color-theme);
										padding: 5px 10px;
										color: var(--color-secondary);

										@media (prefers-color-scheme: dark) {
											font-weight: bold;
										}
									`,
									!label.locked &&
										css`
											border-radius: 9999px;
										`
								].join(" ")}
							>
								{label.name}
							</div>
						))}
					</div>
				)}
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
			</div>
			<HeaderItemArea>
				<EditStoreButton storeId={storeDetail.id} />
			</HeaderItemArea>
		</>
	);
}
