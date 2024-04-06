import { notFound } from "next/navigation";
import { safeString } from "@/libs/safe-type";

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

	return <div>未実装</div>;
}
