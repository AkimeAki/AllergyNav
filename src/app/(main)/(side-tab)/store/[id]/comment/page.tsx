import { notFound } from "next/navigation";
import { safeString } from "@/libs/safe-type";
import { css } from "@kuma-ui/core";
import StoreComment from "@/components/templates/StoreComment";

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
			`}
		>
			<div>
				<p>
					アレルギーの方への対応や、アレルギー除去対応について等、
					<span
						className={css`
							color: var(--color-red);
							font-weight: 700;
							text-decoration: underline;
						`}
					>
						アレルギーに関することのみ記載
					</span>
					をお願いします。
				</p>
			</div>
			<StoreComment id={id} />
		</div>
	);
}
