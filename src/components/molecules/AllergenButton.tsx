/** @jsxImportSource @emotion/react */
"use client";

import type { MouseEvent } from "react";
import AllergenItem from "../atoms/AllergenItem";
import { css } from "@emotion/react";

interface Props {
	image: string;
	text: string;
	selected?: boolean;
	onClick?: (event: MouseEvent<HTMLElement>) => void;
}
export default function ({ image, text, selected = false, onClick }: Props): JSX.Element {
	return (
		<div
			onClick={onClick}
			css={css`
				cursor: pointer;
				user-select: none;

				&:hover {
					img {
						filter: opacity(${selected ? "0.4" : "1"}) ${!selected && "drop-shadow(0px 0px 1px #777777)"};
					}
				}
			`}
		>
			<AllergenItem image={image} text={text} selected={selected} />
		</div>
	);
}
