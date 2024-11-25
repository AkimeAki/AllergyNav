import { notFound } from "next/navigation";
import { safeString } from "@/libs/safe-type";
import { css } from "@kuma-ui/core";
import JsonLD from "@/components/atoms/JsonLD";

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
							border-color: var(--color-theme);
						}

						th {
							text-align: left;
							background-color: var(--color-theme);
							color: var(--color-secondary);
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
					</tbody>
				</table>
			</div>
		</div>
	);
}
