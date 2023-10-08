import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
	title: "お店を追加"
};

export default function Layout(): JSX.Element {
	return <Client />;
}
