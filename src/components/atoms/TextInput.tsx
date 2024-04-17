import { css } from "@kuma-ui/core";
import type { ChangeEventHandler } from "react";

interface Props {
	onChange?: ChangeEventHandler<HTMLInputElement>;
	value?: string;
	disabled?: boolean;
	size?: "small" | "normal";
	password?: boolean;
	autoComplete?: string;
	placeholder?: string;
}

export default function ({
	onChange,
	value,
	disabled = false,
	password = false,
	autoComplete,
	placeholder
}: Props): JSX.Element {
	return (
		<div
			className={css`
				width: 100%;
			`}
		>
			<input
				type={password ? "password" : "text"}
				onChange={onChange}
				value={value}
				placeholder={placeholder}
				disabled={disabled}
				autoComplete={autoComplete}
				className={css`
					display: block;
					width: 100%;
					padding: 5px 20px;
					border-style: solid;
					border-width: 1px;
					border-color: var(--color-theme);
					border-radius: 20px;
					transition-duration: 200ms;
					transition-property: box-shadow;
					background-color: var(--color-white);
					color: var(--color-black);

					&[disabled] {
						background-color: #dbdbdb;
						user-select: none;
						cursor: not-allowed;
					}

					&:focus {
						box-shadow: 0 0 0 1px var(--color-theme);
					}
				`}
			/>
		</div>
	);
}
