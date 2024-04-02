import { notFound } from "next/navigation";
import { safeNumber } from "@/libs/safe-type";
import MenuList from "@/components/organisms/MenuList";

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

	return <MenuList id={id} />;
}
