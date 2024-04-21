import { css } from "@kuma-ui/core";
import type { ChangeEventHandler } from "react";

interface Props {
	onChange?: ChangeEventHandler<HTMLInputElement>;
	disabled?: boolean;
	accept?: string;
}

export default function ({ onChange, disabled = false, accept = undefined }: Props): JSX.Element {
	return (
		<div>
			<input
				type="file"
				onChange={onChange}
				disabled={disabled}
				accept={accept}
				className={css`
					// 文字が欠けないように
					padding-bottom: 5px;

					&::file-selector-button,
					&::-webkit-file-upload-button {
						display: block;
						margin-bottom: 5px;
						text-decoration: none;
						cursor: pointer;
						background-color: var(--color-secondary);
						border-style: solid;
						border-color: var(--color-theme);
						color: var(--color-theme);
						border-width: 2px;
						border-radius: 30px;
						font-weight: 700;
						transition-duration: 200ms;
						transition-property: color, border-color, background-color;
						white-space: nowrap;
						user-select: none;
						text-align: center;
						padding: 10px 20px;
						font-size: 15px;

						&:hover {
							background-color: var(--color-theme);
							color: var(--color-secondary);
						}
					}

					&[disabled] {
						&::file-selector-button,
						&::-webkit-file-upload-button {
							background-color: #dbdbdb;
							user-select: none;
							cursor: not-allowed;
						}
					}
				`}
			/>
		</div>
	);
}
