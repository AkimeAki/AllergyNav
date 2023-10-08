import type { Metadata } from "next";
import Client from "./client";

interface Props {
	params: {
		id: string;
	};
}

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
	let title = "";

	try {
		const id = parseInt(params.id ?? "");
		const result = await fetch(`${process.env.NEXT_API_URL}/store/${id}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json"
			}
		});

		const response = await result.json();
		const data = response.data;
		title = data.name;
	} catch (e) {
		title = "エラー";
	}

	return {
		title: title
	};
};

export default function ({ params }: Props) {
	const id = parseInt(params.id ?? "");

	return <Client id={id} />;
}
