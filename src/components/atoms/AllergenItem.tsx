/** @jsxImportSource @emotion/react */
"use client";

import { css } from "@emotion/react";
import Image from "next/image";
import GoogleIcon from "@/components/atoms/GoogleIcon";

interface Props {
	image: string;
	text: string;
	selected?: boolean;
}
export default function ({ image, text, selected = false }: Props): JSX.Element {
	return (
		<div
			css={css`
				position: relative;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				width: 50px;
			`}
		>
			<Image
				css={css`
					width: 40px;
					aspect-ratio: 1/1;
					object-fit: contain;
					vertical-align: bottom;
					filter: opacity(${selected ? "0.4" : "1"});
					transition-duration: 200ms;
					transition-property: filter;
				`}
				width={100}
				height={100}
				src={image}
				alt=""
			/>
			<div
				css={css`
					position: relative;
					text-align: center;
					white-space: nowrap;
					font-size: 15px;
					font-weight: 700;
					margin-top: 5px;
					z-index: 1;
				`}
			>
				{text}
			</div>
			{selected && (
				<div
					css={css`
						position: absolute;
						top: 50%;
						left: 50%;
						transform: translate(-50%, -50%);
					`}
				>
					<GoogleIcon name="skull" size={40} color="var(--color-red)" />
				</div>
			)}
		</div>
	);
}
