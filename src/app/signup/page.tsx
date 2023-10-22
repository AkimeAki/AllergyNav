import type { Metadata } from "next";
import Client from "./client";
import { notFound } from "next/navigation";

export const generateMetadata = async (): Promise<Metadata> => {
	if (process.env.NODE_ENV !== "development") {
		return notFound();
	}

	return {
		title: "新規登録"
	};
};

export default function (): JSX.Element {
	return <Client />;
}
