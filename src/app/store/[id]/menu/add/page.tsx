import type { Metadata } from "next";
import Client from "./client";

interface Props {
	params: { id: string };
}

export const metadata: Metadata = {
	title: "メニューを追加"
};

export default function ({ params }: Props): JSX.Element {
	const id = parseInt(params.id ?? "");

	return <Client id={id} />;
}
