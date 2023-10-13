import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
	title: "チェーン店を追加"
};

export default function (): JSX.Element {
	return <Client />;
}
