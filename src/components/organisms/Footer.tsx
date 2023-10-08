/** @jsxImportSource @emotion/react */
"use client";

import { css } from "@emotion/react";
import SvgImage from "@/components/atoms/SvgImage";
import FooterLink from "@/components/atoms/FooterLink";

export default function () {
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
					<SvgImage
						src={"/logo/twitter.svg"}
						size="25px"
						color="var(--color-black)"
						style={css`
							transform: translate(1px, 0px);
						`}
					/>
				</FooterLink>
			</div>
		</footer>
	);
}
