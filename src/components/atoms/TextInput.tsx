/** @jsxImportSource @emotion/react */
"use client";

import { css } from "@emotion/react";
import type { ChangeEventHandler } from "react";

interface Props {
	onChange?: ChangeEventHandler<HTMLInputElement>;
	value?: string;
}

export default function TextInput({ onChange, value }: Props): JSX.Element {
	return (
		<div
			css={css`
				position: relative;
			`}
		>
			<input
				type="text"
				onChange={onChange}
				value={value}
				css={css`
					display: block;
					width: 100%;
					padding: 10px;
					border: none;

					&:focus + div {
						width: 100%;
					}
				`}
			/>
			<div
				css={css`
					position: absolute;
					bottom: 0;
					left: 0;
					width: 0;
					height: 2px;
					background-color: var(--color-purple);
					transition-duration: 400ms;
					transition-property: width;
					z-index: 2;
				`}
			/>
			<div
				css={css`
					position: absolute;
					bottom: 0;
					left: 0;
					width: 100%;
					height: 2px;
					background-color: var(--color-orange);
					z-index: 1;
				`}
			/>
		</div>
	);
}
