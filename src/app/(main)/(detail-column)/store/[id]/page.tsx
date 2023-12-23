import { notFound } from "next/navigation";
import { safeNumber } from "@/libs/trans-type";
import { css } from "@kuma-ui/core";
import Link from "next/link";

interface Props {
	params: {
		id: string;
	};
}

export default async function ({ params }: Props): Promise<JSX.Element> {
	const id = safeNumber(params.id);

	if (id === null) {
		notFound();
	}

	let storeDetail;
	let coordinate;
	try {
		const storeDetailFetchResult = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store/${id}`, {
			method: "GET"
		});

		if (storeDetailFetchResult.status !== 200) {
			throw new Error();
		}

		storeDetail = await storeDetailFetchResult.json();

		const storeAccessFetchResponse = await fetch(
			`https://msearch.gsi.go.jp/address-search/AddressSearch?q=${storeDetail.address}`,
			{
				method: "GET"
			}
		);
		const storeAccessData = await storeAccessFetchResponse.json();

		if (storeAccessData.length === 1) {
			coordinate = `${storeAccessData[0].geometry.coordinates[1]},${storeAccessData[0].geometry.coordinates[0]}`;
		}
	} catch (e) {}

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
					border-top-left-radius: 20px;
					border-bottom-left-radius: 20px;
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
							border-color: var(--color-orange);
						}

						th {
							text-align: left;
							background-color: var(--color-orange);
							color: white;
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
								{storeDetail.group_id !== null ? (
									<Link href={`/chain/${storeDetail.group_id}`}>グループ</Link>
								) : (
									<span>なし</span>
								)}
							</td>
						</tr>
						<tr>
							<th>住所</th>
							<td>
								<Link href={`https://www.google.com/maps/place/${storeDetail.address}`}>
									{storeDetail.address}
								</Link>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			{storeDetail !== undefined && storeDetail.description !== "" && (
				<div
					dangerouslySetInnerHTML={{
						__html: storeDetail.description
					}}
				/>
			)}
			{coordinate !== undefined && (
				<iframe
					src={`http://maps.google.co.jp/maps?q=${coordinate}&output=embed&t=m&z=17`}
					className={css`
						border: none;
						width: 100%;
						height: 400px;
					`}
				/>
			)}
		</div>
	);
}
