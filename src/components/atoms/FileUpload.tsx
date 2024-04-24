import { css } from "@kuma-ui/core";
import type { ChangeEventHandler } from "react";
import LoadingCircle from "@/components/atoms/LoadingCircle";

interface Props {
	onChange?: ChangeEventHandler<HTMLInputElement>;
	disabled?: boolean;
	loading?: boolean;
	accept?: string;
}

export default function ({ onChange, disabled = false, loading = false, accept = undefined }: Props): JSX.Element {
	return (
		<div
			className={css`
				position: relative;
			`}
		>
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
			{loading && (
				<div
					className={css`
						position: absolute;
						top: 50%;
						left: 50%;
						transform: translate(-50%, -50%);
					`}
				>
					<LoadingCircle size={20} />
				</div>
			)}
		</div>
	);
}
