import type { Metadata } from "next";
import Client from "./client";
import { notFound } from "next/navigation";

interface Props {
	params: {
		id: string;
	};
}

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
	let title = "";

	try {
		const id = parseInt(params.id ?? "");
		const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store/${id}`, {
			method: "GET"
		});

		if (result.status !== 200) {
			throw new Error();
		}

		const response = await result.json();
		title = response.name;
	} catch (e) {
		notFound();
	}

	return {
		title
	};
};

export default async function ({ params }: Props): Promise<JSX.Element> {
	const id = parseInt(params.id);

	return <Client id={id} />;
}
