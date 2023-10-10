import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
	title: "お店一覧"
};

export default function (): JSX.Element {
	return <Client />;
}
