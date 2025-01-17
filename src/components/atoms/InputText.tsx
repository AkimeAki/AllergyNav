"use client";

import { ChangeEvent, KeyboardEvent, InputHTMLAttributes } from "react";
import { css } from "@kuma-ui/core";
import LoadingCircle from "@/components/atoms/LoadingCircle";

interface Props {
	placeholder?: InputHTMLAttributes<HTMLInputElement>["placeholder"];
	onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
	onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
	value?: InputHTMLAttributes<HTMLInputElement>["value"];
	password?: boolean;
	disabled?: boolean;
	loading?: boolean;
}

export default function ({
	placeholder,
	onChange,
	onKeyDown,
	value,
	password = false,
	disabled = false,
	loading = false
}: Props) {
	return (
		<div
			className={css`
				position: relative;
				width: 100%;
			`}
		>
			<input
				placeholder={placeholder}
				type={password ? "password" : "text"}
				disabled={disabled}
				onChange={onChange}
				onKeyDown={onKeyDown}
				value={value}
				className={css`
					width: 100%;
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

					&[disabled] {
						background-color: var(--color-primary-thin);
						user-select: none;
						cursor: not-allowed;
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
