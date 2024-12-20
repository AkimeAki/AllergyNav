import Header from "@/components/organisms/Header";
import Sidebar from "@/components/organisms/Sidebar";
import { Suspense, type ReactNode } from "react";
import { css } from "@kuma-ui/core";
import Footer from "@/components/organisms/Footer";
import ScrollTop from "@/components/molecules/ScrollTop";
import NextTopLoader from "nextjs-toploader";

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

				&[data-select="none"] {
					user-select: none;
					pointer-events: none;

					* {
						user-select: none;
						pointer-events: none;
					}
				}
			`}
		>
			<NextTopLoader color="var(--color-theme)" showSpinner={false} />
			<Suspense>
				<ScrollTop />
			</Suspense>
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

							@media (max-width: 800px) {
								padding: 0 10px 90px 10px;
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
