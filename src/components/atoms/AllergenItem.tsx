/** @jsxImportSource @emotion/react */
"use client";

import type { MouseEvent } from "react";
import { css } from "@emotion/react";
import type { SerializedStyles } from "@emotion/react";
import Image from "next/image";

interface Props {
	image: string;
	text: string;
	selected?: boolean;
	onClick?: (event: MouseEvent<HTMLElement>) => void;
	style?: SerializedStyles;
}
export default function AllergenItem({ image, text, selected = false, onClick, style = css`` }: Props): JSX.Element {
	return (
		<div
			css={css`
				position: relative;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				width: 90px;
				cursor: pointer;
				user-select: none;

				&:hover > img {
					filter: opacity(${selected ? "0.4" : "1"}) ${!selected && "drop-shadow(0px 0px 1px #777777)"};
				}

				${style}
			`}
			onClick={onClick}
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
