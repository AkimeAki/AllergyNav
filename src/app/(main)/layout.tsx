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
		<>
			<Header />
			<Sidebar />
			<main
				className={css`
					width: 100%;
					padding-top: 70px;
				`}
			>
				<div
					className={css`
						max-width: 1200px;
						margin: 0 auto;
						padding: 90px 30px;
					`}
				>
					{children}
				</div>
			</main>
			<Footer />
		</>
	);
}
