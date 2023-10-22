/** @jsxImportSource @emotion/react */
"use client";

import Messages from "@/components/molecules/Messages";
import AdminHeader from "@/components/organisms/AdminHeader";
import { css } from "@emotion/react";
import type { ReactNode } from "react";

interface Props {
	children: ReactNode;
}

export default function ({ children }: Props): JSX.Element {
	return (
		<>
			<AdminHeader />
			<Messages />
			<div
				css={css`
					padding-left: 300px;

					@media (max-width: 1000px) {
						padding-left: 0px;
					}
				`}
			>
				<main
					css={css`
						max-width: 1200px;
						width: 100%;
						margin: 0 auto;
						padding: 90px 30px 40px 30px;

						@media (max-width: 1000px) {
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
			</div>
		</>
	);
}
