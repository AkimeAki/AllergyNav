import MenuList from "@/components/templates/MenuList";
import { getStore } from "@/libs/server-fetch";

interface Props {
	params: {
		id: string;
	};
}

export default async function ({ params }: Props): Promise<JSX.Element> {
	const store = await getStore(params.id);

	return <MenuList id={store.id} />;
}
