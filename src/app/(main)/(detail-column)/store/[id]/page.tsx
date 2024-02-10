import { notFound } from "next/navigation";
import { safeNumber } from "@/libs/safe-type";
import { css } from "@kuma-ui/core";
import Link from "next/link";
import GoogleMap from "@/components/organisms/GoogleMap";
import sanitizeHtml from "sanitize-html";

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
	try {
		const storeDetailFetchResult = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store/${id}`, {
			method: "GET"
		});

		if (storeDetailFetchResult.status !== 200) {
			throw new Error();
		}

		storeDetail = await storeDetailFetchResult.json();
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
								<Link href={`https://www.google.com/maps/place/${storeDetail.address}`} target="_blank">
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
						__html: sanitizeHtml(storeDetail.description, {
							allowedTags: [],
							allowedAttributes: {},
							disallowedTagsMode: "recursiveEscape"
						})
					}}
				/>
			)}
			<GoogleMap address={storeDetail.address} />
		</div>
	);
}
