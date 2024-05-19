import SubTitle from "@/components/atoms/SubTitle";
import { css } from "@kuma-ui/core";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "お店のグループ一覧"
};

export const runtime = "edge";

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
			<SubTitle>お店のグループ一覧</SubTitle>
			<div>未実装</div>
		</div>
	);
}
