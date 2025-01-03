import { defaultDescription, siteTitle } from "@/definition";
import type { Metadata } from "next";

interface Props {
	title?: string;
	description?: string;
	isFullTitle?: boolean;
	canonicalPath: string;
	noIndex?: boolean;
}

export const seoHead = ({
	title,
	isFullTitle = false,
	description = defaultDescription,
	canonicalPath,
	noIndex = false
}: Props): Metadata => {
	let metaTitle = `${siteTitle} - アレルギーの方向けのグルメナビ`;
	if (title !== undefined) {
		if (isFullTitle) {
			metaTitle = title;
		} else {
			metaTitle = `${title} - ${siteTitle}`;
		}
	}

	return {
		title: metaTitle,
		description,
		authors: { name: "彩季", url: "https://aki.wtf" },
		generator: "nextjs",
		keywords: ["アレルギー", "飲食店", "メニュー表", "アレルギーナビ", "Allergy", "グルメ"],
		creator: "彩季",
		openGraph: {
			type: "website",
			url: process.env.SITEURL,
			title: title ?? siteTitle,
			description,
			siteName: siteTitle,
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
		},
		robots: {
			index: !noIndex // noindexの設定
		}
	};
};
