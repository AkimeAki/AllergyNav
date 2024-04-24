import { css } from "@kuma-ui/core";
import type { ChangeEventHandler, InputHTMLAttributes, KeyboardEventHandler } from "react";
import LoadingCircle from "@/components/atoms/LoadingCircle";

interface Props {
	onChange?: ChangeEventHandler<HTMLInputElement>;
	onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
	value?: string;
	disabled?: boolean;
	loading?: boolean;
	size?: "small" | "normal";
	password?: boolean;
	autoComplete?: string;
	placeholder?: string;
	enterKeyHint?: InputHTMLAttributes<HTMLInputElement>["enterKeyHint"];
}

export default function ({
	onChange,
	onKeyDown,
	value = "",
	disabled = false,
	loading = false,
	password = false,
	autoComplete,
	placeholder,
	enterKeyHint
}: Props): JSX.Element {
	return (
		<div
			className={css`
				position: relative;
				width: 100%;
			`}
		>
			<input
				enterKeyHint={enterKeyHint}
				type={password ? "password" : "text"}
				onChange={onChange}
				onKeyDown={onKeyDown}
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
					background-color: var(--color-secondary);
					color: var(--color-primary);

					&[disabled] {
						background-color: var(--color-hide);
						user-select: none;
						cursor: not-allowed;
					}

					&:focus {
						box-shadow: 0 0 0 1px var(--color-theme);
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
