import MenuList from "@/components/templates/MenuList";
import { seoHead } from "@/libs/seo";
import { getStore } from "@/libs/server-fetch";
import type { Metadata } from "next";

interface Props {
	params: {
		id: string;
	};
}

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
	const storeDetail = await getStore(params.id);

	return seoHead({
		title: `メニュー - ${storeDetail.name}`,
		description: `『${storeDetail.name}』のメニューページです。アレルギー情報を得た方、持っている方はアレルギーナビに情報を追加してくれると助かります。`
	});
};

export default async function ({ params }: Props): Promise<JSX.Element> {
	const store = await getStore(params.id);

	return <MenuList storeId={store.id} />;
}
