import RegisterForm from "@/components/templates/RegisterForm";
import { css } from "@kuma-ui/core";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "アカウント作成"
};

export default function (): JSX.Element {
	return (
		<div
			className={css`
				width: 100%;
				max-width: 500px;
				margin: 0 auto;
			`}
		>
			<div>
				<RegisterForm />
			</div>
		</div>
	);
}
