import { notFound } from "next/navigation";
import { safeString } from "@/libs/safe-type";
import StorePictureList from "@/components/templates/StorePictureList";

interface Props {
	params: {
		id: string;
	};
}

export const runtime = "edge";

export default async function ({ params }: Props): Promise<JSX.Element> {
	const id = safeString(params.id);

	if (id === null) {
		notFound();
	}

	return <StorePictureList storeId={id} />;
}
