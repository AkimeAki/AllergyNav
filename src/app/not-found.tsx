import type { Metadata } from "next";
import Client from "./not-found-client";
import Main from "@/layouts/Main";

export const metadata: Metadata = {
	title: "ページが見つかりませんでした"
};

export default function (): JSX.Element {
	return (
		<>
			<Main>
				<Client />
			</Main>
		</>
	);
}
