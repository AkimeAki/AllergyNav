import SubTitle from "@/components/atoms/SubTitle";
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
			<SubTitle>お店一覧</SubTitle>
			<StoreList />
		</div>
	);
}
