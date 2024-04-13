import { notFound } from "next/navigation";
import { safeString } from "@/libs/safe-type";
import { css } from "@kuma-ui/core";
import Link from "next/link";
import GoogleMap from "@/components/organisms/GoogleMap";
import { formatText } from "@/libs/format-text";
import EditStoreButton from "@/components/organisms/EditStoreButton";
import { prisma } from "@/libs/prisma";
import Image from "next/image";

interface Props {
	params: {
		id: string;
	};
}

export default async function ({ params }: Props): Promise<JSX.Element> {
	const id = safeString(params.id);

	if (id === null) {
		notFound();
	}

	const result = await prisma.store.findUnique({
		select: {
			name: true,
			address: true,
			description: true
		},
		where: { id }
	});

	if (result === null) {
		notFound();
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
									href={`https://www.google.com/maps/search/${result.address} ${result.name}`}
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
										{result.address}
									</span>
								</Link>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			{result.description !== "" && (
				<div
					dangerouslySetInnerHTML={{
						__html: formatText(result.description)
					}}
				/>
			)}
			<GoogleMap address={result.address} />
			<EditStoreButton storeId={id} />
		</div>
	);
}
