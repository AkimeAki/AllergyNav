/** @jsxImportSource @emotion/react */
"use client";

import Messages from "@/components/molecules/Messages";
import Header from "@/components/organisms/Header";
import type { ReactNode } from "react";
import { RecoilRoot } from "recoil";
import { css } from "@emotion/react";
import Footer from "@/components/organisms/Footer";

interface Props {
	children: ReactNode;
}

export default function ({ children }: Props) {
	return (
		<RecoilRoot>
			<Header />
			<Messages />
			<main
				css={css`
					max-width: 1200px;
					width: 100%;
					margin: 0 auto;
					padding: 90px 10px 40px 10px;
					min-height: calc(100% - 200px);
				`}
			>
				{children}
			</main>
			<Footer />
		</RecoilRoot>
	);
}
