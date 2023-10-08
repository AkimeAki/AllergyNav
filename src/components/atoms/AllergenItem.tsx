/** @jsxImportSource @emotion/react */
"use client";

import type { MouseEvent } from "react";
import { css } from "@emotion/react";

interface Props {
	image: string;
	text: string;
	selected?: boolean;
	onClick?: (event: MouseEvent<HTMLElement>) => void;
}
export default function AllergyItem({ image, text, selected = false, onClick }: Props) {
	return (
		<div
			css={css`
				position: relative;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				width: 90px;
				aspect-ratio: 1/1;
				cursor: pointer;
				user-select: none;

				&:hover > img {
					filter: opacity(${selected ? "0.4" : "1"}) ${!selected && "drop-shadow(0px 0px 1px #777777)"};
				}
			`}
			onClick={onClick}
		>
			<img
				css={css`
					width: 40px;
					aspect-ratio: 1/1;
					object-fit: contain;
					vertical-align: bottom;
					filter: opacity(${selected ? "0.4" : "1"});
					transition-duration: 200ms;
					transition-property: filter;
				`}
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
						color: var(--color-red);
						font-size: 40px;
					`}
					className="material-symbols-outlined"
				>
					skull
				</div>
			)}
		</div>
	);
}
