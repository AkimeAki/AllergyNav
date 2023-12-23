import { css } from "@kuma-ui/core";
import type { ChangeEventHandler } from "react";

interface Props {
	value?: string;
	disabled?: boolean;
	onChange?: ChangeEventHandler<HTMLTextAreaElement>;
}

export default function ({ value = "", onChange, disabled = false }: Props): JSX.Element {
	return (
		<textarea
			value={value}
			disabled={disabled}
			onChange={onChange}
			className={css`
				width: 100%;
				height: 80px;
				resize: none;
				border-style: solid;
				border-width: 1px;
				border-color: var(--color-orange);
				padding: 10px 20px;
				border-radius: 5px;
				line-height: 20px;
				font-size: 18px;
				transition-duration: 200ms;
				transition-property: border-color, box-shadow;
				overflow-y: scroll;

				&:focus {
					box-shadow: 0 0 0 1px var(--color-orange);
				}

				&[disabled] {
					background-color: var(--color-gray);
					user-select: none;
					cursor: default;

					&:focus {
						border-color: var(--color-orange);
					}
				}
			`}
		/>
	);
}
