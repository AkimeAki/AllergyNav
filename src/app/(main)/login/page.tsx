import LoginForm from "@/components/templates/LoginForm";
import { css } from "@kuma-ui/core";
import type { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
	title: "ログイン"
};

export default async function (): Promise<JSX.Element> {
	const session = await getServerSession();
	const user = session?.user;

	if (user?.email !== undefined && user.email !== null) {
		redirect("/");
	}

	return (
		<div
			className={css`
				width: 100%;
				max-width: 500px;
				margin: 0 auto;
			`}
		>
			<div>
				<LoginForm />
			</div>
		</div>
	);
}
