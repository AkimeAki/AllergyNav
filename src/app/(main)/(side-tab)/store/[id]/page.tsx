import { css } from "@kuma-ui/core";
import Link from "next/link";
import GoogleMap from "@/components/molecules/GoogleMap";
import { formatText } from "@/libs/format-text";
import EditStoreButton from "@/components/organisms/EditStoreButton";
import Image from "next/image";
import { getStore } from "@/libs/server-fetch";
interface Props {
	params: {
		id: string;
	};
}

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
						}

						th {
							text-align: left;
							background-color: var(--color-theme);
							color: var(--color-white);
							font-weight: bold;
							padding-left: 20px;
							padding-right: 20px;
							width: 120px;
						}
					`}
				>
					<tbody>
						<tr>
							<th>グループ</th>
							<td>
								<span>（未実装）</span>
							</td>
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
			<GoogleMap address={storeDetail.address} />
			<EditStoreButton storeId={storeDetail.id} />
		</div>
	);
}
