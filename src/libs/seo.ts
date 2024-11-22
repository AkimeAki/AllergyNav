import type { Metadata } from "next";

interface Props {
	title?: string;
	description?: string;
	isFullTitle?: boolean;
	canonicalPath: string;
}

export const seoHead = ({
	title,
	isFullTitle = false,
	description = "『アレルギーナビ』は、アレルギーの方々が少しでも多く、食べに行ける飲食店が見つけられるように作ったサービスです。どこかの飲食店のアレルギー情報を得た方、持っている方はアレルギーナビに情報を追加してくれると助かります。",
	canonicalPath
}: Props): Metadata => {
	let metaTitle = "アレルギーナビ｜アレルギーの方向けの飲食店情報サービス";
	if (title !== undefined) {
		if (isFullTitle) {
			metaTitle = title;
		} else {
			metaTitle = `${title}｜アレルギーナビ`;
		}
	}

	return {
		title: metaTitle,
		description,
		authors: { name: "彩季", url: "https://aki.wtf" },
		generator: "nextjs",
		keywords: ["アレルギー", "飲食店", "メニュー表", "アレルギーナビ", "Allergy"],
		creator: "彩季",
		openGraph: {
			type: "website",
			url: process.env.SITEURL,
			title: title ?? "アレルギーナビ",
			description,
			siteName: "アレルギーナビ",
			images: {
				url: `${process.env.SITEURL}/favicon.png`
			}
		},
		twitter: {
			card: "summary",
			site: "@Akime_Aki",
			creator: "@Akime_Aki",
			images: `${process.env.SITEURL}/favicon.png`
		},
		icons: `${process.env.SITEURL}/favicon.png`,
		manifest: `${process.env.SITEURL}/manifest.json`,
		alternates: {
			canonical: `${process.env.SITEURL}${canonicalPath}`
		}
	};
};
