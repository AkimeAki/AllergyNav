import MenuList from "@/components/templates/MenuList";
import { getStore } from "@/libs/server-fetch";
import type { Metadata } from "next";

interface Props {
	params: {
		id: string;
	};
}

export const metadata: Metadata = {
	title: "メニュー"
};

export default async function ({ params }: Props): Promise<JSX.Element> {
	const store = await getStore(params.id);

	return <MenuList storeId={store.id} />;
}
