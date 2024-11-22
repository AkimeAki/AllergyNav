import { notFound } from "next/navigation";
import { safeString } from "@/libs/safe-type";
import { css } from "@kuma-ui/core";
import StoreComment from "@/components/templates/StoreComment";
import type { Metadata } from "next";
import { getStore } from "@/libs/server-fetch";
import { seoHead } from "@/libs/seo";

interface Props {
	params: {
		id: string;
	};
}

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
	const storeDetail = await getStore(params.id);

	return seoHead({
		title: `コメント - ${storeDetail.name}`,
		description: `『${storeDetail.name}』のコメントページです。アレルギー情報を得た方、持っている方はアレルギーナビに情報を追加してくれると助かります。`,
		canonicalPath: `/food/${storeDetail.id}/comment`
	});
};

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
							font-weight: bold;
							text-decoration: underline;
						`}
					>
						アレルギーに関することのみ記載
					</span>
					をお願いします。
				</p>
			</div>
			<StoreComment storeId={id} />
		</div>
	);
}
