import { notFound } from "next/navigation";
import { safeString } from "@/libs/safe-type";
import { css } from "@kuma-ui/core";
import JsonLD from "@/components/atoms/JsonLD";

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

	return (
		<div>
			<p>実装をお待ち下さい</p>
		</div>
	);
}
