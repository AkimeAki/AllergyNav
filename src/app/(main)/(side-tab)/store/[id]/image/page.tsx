import { notFound } from "next/navigation";
import { safeBigInt } from "@/libs/safe-type";

interface Props {
	params: {
		id: string;
	};
}

export default async function ({ params }: Props): Promise<JSX.Element> {
	const id = safeBigInt(params.id);

	if (id === null) {
		notFound();
	}

	return <div>未実装</div>;
}
