/** @jsxImportSource @emotion/react */
"use client";

import { css } from "@emotion/react";
import SvgImage from "@/components/atoms/SvgImage";
import FooterLink from "@/components/molecules/FooterLink";
import { viewSidebarWidth } from "@/definition";

export default function (): JSX.Element {
	return (
		<footer
			css={css`
				display: flex;
				flex-direction: column;
				align-items: cneter;
				justify-content: center;
				background-color: var(--color-green);
				height: 200px;
				color: white;
				gap: 30px;

				@media (max-width: ${viewSidebarWidth}px) {
					display: none;
				}
			`}
		>
			<div
				css={css`
					display: inline-block;
					font-weight: 700;
					text-align: center;
				`}
			>
				&copy; 彩季
			</div>
			<div
				css={css`
					display: flex;
					justify-content: center;
					text-align: center;
					gap: 20px;
				`}
			>
				<FooterLink href="https://twitter.com/Akime_Aki">
					<SvgImage src={"/logo/x.svg"} size="20px" color="var(--color-black)" />
				</FooterLink>
				<FooterLink href="https://twitter.com/Akime_Aki">
					<div
						css={css`
							transform: translate(1px, 0px);
							font-size: 0;
						`}
					>
						<SvgImage src={"/logo/twitter.svg"} size="25px" color="var(--color-black)" />
					</div>
				</FooterLink>
				<FooterLink href="https://github.com/AkimeAki/AllergyNav">
					<div
						css={css`
							transform: translate(0px, -1px);
							font-size: 0;
						`}
					>
						<SvgImage src={"/logo/github.svg"} size="30px" color="var(--color-black)" />
					</div>
				</FooterLink>
			</div>
		</footer>
	);
}
