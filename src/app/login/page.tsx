import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
	title: "ログイン"
};

export default function (): JSX.Element {
	return <Client />;
}
