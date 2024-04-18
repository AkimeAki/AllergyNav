import { css } from "@kuma-ui/core";
import type { ChangeEventHandler, MouseEventHandler, ReactNode } from "react";

interface Props {
	value?: string;
	disabled?: boolean;
	onChange?: ChangeEventHandler<HTMLSelectElement>;
	onClick?: MouseEventHandler<HTMLSelectElement>;
	children: ReactNode;
}

export default function ({ value = "", disabled = false, onChange, onClick, children }: Props): JSX.Element {
	return (
		<select
			size={1}
			value={value}
			disabled={disabled}
			onChange={onChange}
			onClick={onClick}
			className={css`
				border: none;
				border-bottom-style: solid;
				border-bottom-color: var(--color-theme);
				border-bottom-width: 2px;
				padding: 10px 20px 10px 10px;
				cursor: pointer;
				border-top-left-radius: 5px;
				border-top-right-radius: 5px;
				background-color: var(--color-white);

				&[disabled] {
					background-color: #e4e4e4;
					user-select: none;
					cursor: not-allowed;
				}
			`}
		>
			{children}
		</select>
	);
}
