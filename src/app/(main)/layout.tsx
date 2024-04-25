import Header from "@/components/organisms/Header";
import Sidebar from "@/components/organisms/Sidebar";
import type { ReactNode } from "react";
import { css } from "@kuma-ui/core";
import Footer from "@/components/organisms/Footer";

interface Props {
	children: ReactNode;
}

export default function ({ children }: Props): JSX.Element {
	return (
		<div
			id="root"
			className={css`
				position: relative;
				width: 100%;
				height: 100svh;
				overflow-y: scroll;
				display: flex;
				flex-direction: column;
			`}
		>
			<div
				className={css`
					flex: 1;
				`}
			>
				<Header />
				<Sidebar />
				<main
					className={css`
						width: 100%;
					`}
				>
					<div
						className={css`
							max-width: 1200px;
							margin: 0 auto;
							padding: 0 30px 90px 30px;

							@media (max-width: 600px) {
								padding: 0 20px 90px 20px;
							}
						`}
					>
						{children}
					</div>
				</main>
			</div>
			<Footer />
		</div>
	);
}
