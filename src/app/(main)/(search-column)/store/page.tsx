import MainTitle from "@/components/atoms/MainTitle";
import StoreList from "@/components/templates/StoreList";
import { css } from "@kuma-ui/core";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "お店一覧"
};

export default function (): JSX.Element {
	return (
		<div
			className={css`
				position: relative;
				display: flex;
				flex-direction: column;
				gap: 20px;
			`}
		>
			<MainTitle>お店一覧</MainTitle>
			<StoreList />
		</div>
	);
}
