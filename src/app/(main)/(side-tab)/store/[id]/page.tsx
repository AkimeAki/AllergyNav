import { css } from "@kuma-ui/core";
import Link from "next/link";
import GoogleMap from "@/components/molecules/GoogleMap";
import { formatText } from "@/libs/format-text";
import EditStoreButton from "@/components/organisms/EditStoreButton";
import Image from "next/image";
import { getStore } from "@/libs/server-fetch";
import SubTitle from "@/components/atoms/SubTitle";

interface Props {
	params: {
		id: string;
	};
}

export const runtime = "edge";

export default async function ({ params }: Props): Promise<JSX.Element> {
	const storeDetail = await getStore(params.id);

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
							width: 210px;

							@media (max-width: 600px) {
								width: 160px;
								font-size: 15px;
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
								<Link
									className={css`
										display: inline-flex;
										align-items: center;
										gap: 5px;
									`}
									href={`https://www.google.com/maps/search/${storeDetail.address} ${storeDetail.name}`}
									target="_blank"
								>
									<Image
										width={20}
										height={20}
										src="/icons/google-map.svg"
										alt="Google マップのアイコン"
									/>
									<span
										className={css`
											color: inherit;
										`}
									>
										{storeDetail.address}
									</span>
								</Link>
							</td>
						</tr>
						{storeDetail.url !== null && (
							<tr>
								<th>公式サイト</th>
								<td>
									<a href={storeDetail.url} target="_blank">
										{storeDetail.url}
									</a>
								</td>
							</tr>
						)}
						{storeDetail.allergy_menu_url !== null && (
							<tr>
								<th>公式アレルギー成分表</th>
								<td>
									<a href={storeDetail.allergy_menu_url} target="_blank">
										{storeDetail.allergy_menu_url}
									</a>
								</td>
							</tr>
						)}
						{storeDetail.tabelog_url !== null && (
							<tr>
								<th>食べログ</th>
								<td>
									<a href={storeDetail.tabelog_url} target="_blank">
										{storeDetail.tabelog_url}
									</a>
								</td>
							</tr>
						)}
						{storeDetail.gurunavi_url !== null && (
							<tr>
								<th>ぐるなび</th>
								<td>
									<a href={storeDetail.gurunavi_url} target="_blank">
										{storeDetail.gurunavi_url}
									</a>
								</td>
							</tr>
						)}
						{storeDetail.hotpepper_url !== null && (
							<tr>
								<th>ホットペッパーグルメ</th>
								<td>
									<a href={storeDetail.hotpepper_url} target="_blank">
										{storeDetail.hotpepper_url}
									</a>
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
