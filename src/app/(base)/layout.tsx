import Header from "@/components/organisms/Header";
import MainMenu from "@/components/organisms/MainMenu";
import type { ReactNode } from "react";
import { css } from "@kuma-ui/core";
import Footer from "@/components/organisms/Footer";
import NextTopLoader from "nextjs-toploader";
import CheckBrowser from "@/components/organisms/CheckBrowser";
import ScrollTop from "@/components/organisms/ScrollTop";

interface Props {
	children: ReactNode;
}

export default function ({ children }: Props): JSX.Element {
	return (
		<>
			<NextTopLoader color="var(--color-theme)" showSpinner={false} zIndex={99999} />
			<CheckBrowser />
			<ScrollTop />
			<Header />
			<MainMenu />
			{children}
			<div
				className={css`
					margin-top: 90px;
				`}
			>
				<Footer />
			</div>
		</>
	);
}
