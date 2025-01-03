"use client";

import { ChangeEvent, KeyboardEvent, InputHTMLAttributes } from "react";
import { css } from "@kuma-ui/core";

interface Props {
	placeholder?: InputHTMLAttributes<HTMLInputElement>["placeholder"];
	onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
	onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
	value?: InputHTMLAttributes<HTMLInputElement>["value"];
}

export default function ({ placeholder, onChange, onKeyDown, value }: Props) {
	return (
		<input
			placeholder={placeholder}
			onChange={(e) => {
				if (onChange !== undefined) {
					onChange(e);
				}
			}}
			onKeyDown={(e) => {
				if (onKeyDown !== undefined) {
					onKeyDown(e);
				}
			}}
			value={value}
			className={css`
				border: 1px solid #a7a7a7;
				border-radius: 4px;
				font-size: 14px;
				padding: 7px 15px;
				height: 40px;
				background-color: var(--color-secondary);
				color: var(--color-primary);
				align-content: center;

				@media (max-width: 500px) {
					font-size: 12px;
				}

				&::placeholder {
					color: var(--color-primary);
				}

				&:focus {
					position: relative;
					outline: 2px solid var(--color-theme);
					outline-offset: -1px;
				}
			`}
		/>
	);
}
