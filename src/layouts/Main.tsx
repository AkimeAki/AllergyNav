/** @jsxImportSource @emotion/react */
"use client";

import Messages from "@/components/molecules/Messages";
import Header from "@/components/organisms/Header";
import { css } from "@emotion/react";
import Footer from "@/components/organisms/Footer";
import type { ReactNode } from "react";
import { viewSidebarWidth } from "@/definition";

interface Props {
	children: ReactNode;
}

export default function ({ children }: Props): JSX.Element {
	return (
		<>
			<Header />
			<Messages />
			<main
				css={css`
					max-width: 1200px;
					width: 100%;
					margin: 0 auto;
					padding: 90px 30px 40px 30px;
					min-height: calc(100% - 200px);

					@media (max-width: ${viewSidebarWidth}px) {
						padding-bottom: 90px;
					}

					@media (max-width: 500px) {
						padding-right: 10px;
						padding-left: 10px;
					}
				`}
			>
				{children}
			</main>
			<Footer />
		</>
	);
}
