import { notFound } from "next/navigation";
import { safeString } from "@/libs/safe-type";
import StorePictureList from "@/components/templates/StorePictureList";
import type { Metadata } from "next";

interface Props {
	params: {
		id: string;
	};
}

export const metadata: Metadata = {
	title: "写真"
};

export default async function ({ params }: Props): Promise<JSX.Element> {
	const id = safeString(params.id);

	if (id === null) {
		notFound();
	}

	return <StorePictureList storeId={id} />;
}
