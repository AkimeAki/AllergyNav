import SubTitle from "@/components/atoms/SubTitle";
// import StoreGroupList from "@/components/organisms/StoreGroupList";
import { css } from "@kuma-ui/core";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "お店のグループ一覧"
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
			<SubTitle>お店のグループ一覧</SubTitle>
			{/* <StoreGroupList /> */}
			<div>未実装</div>
		</div>
	);
}
