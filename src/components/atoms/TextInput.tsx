/** @jsxImportSource @emotion/react */
"use client";

import { css } from "@emotion/react";
import type { ChangeEventHandler } from "react";

interface Props {
	onChange?: ChangeEventHandler<HTMLInputElement>;
	value?: string;
	disabled?: boolean;
	size?: "small" | "normal";
	password?: boolean;
	autoComplete?: string;
}

export default function ({
	onChange,
	value,
	disabled = false,
	size = "normal",
	password = false,
	autoComplete
}: Props): JSX.Element {
	return (
		<div
			css={css`
				position: relative;
				width: 100%;
			`}
		>
			<input
				type={password ? "password" : "text"}
				onChange={onChange}
				value={value}
				disabled={disabled}
				autoComplete={autoComplete}
				css={css`
					display: block;
					width: 100%;
					padding: ${size === "small" ? "5px 10px" : "10px"};
					border: none;

					&:focus + div {
						width: 100%;
					}

					&[disabled] {
						background-color: #e4e4e4;
						user-select: none;
						cursor: wait;

						&:focus + div {
							width: 0;
						}
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
					background-color: var(--color-green);
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
