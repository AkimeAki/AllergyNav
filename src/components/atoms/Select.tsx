import { css } from "@kuma-ui/core";
import type { ChangeEventHandler, MouseEventHandler, ReactNode } from "react";
import LoadingCircle from "@/components/atoms/LoadingCircle";

interface Props {
	value?: string;
	disabled?: boolean;
	loading?: boolean;
	onChange?: ChangeEventHandler<HTMLSelectElement>;
	onClick?: MouseEventHandler<HTMLSelectElement>;
	children: ReactNode;
}

export default function ({
	value = "",
	disabled = false,
	loading = false,
	onChange,
	onClick,
	children
}: Props): JSX.Element {
	return (
		<div
			data-disabled={disabled}
			data-loading={loading}
			className={css`
				position: relative;
				display: table;
				cursor: pointer;
				border-bottom-style: solid;
				border-bottom-color: var(--color-theme);
				border-bottom-width: 2px;
				border-top-left-radius: 5px;
				border-top-right-radius: 5px;
				background-color: var(--color-secondary);

				&[data-disabled="true"] {
					background-color: var(--color-primary-thin);
					cursor: not-allowed;
					user-select: none;
				}

				&[data-loading="true"] {
					cursor: progress;
				}
			`}
		>
			<select
				size={1}
				value={value}
				disabled={disabled}
				onChange={onChange}
				onClick={onClick}
				className={css`
					border: none;
					padding: 10px 20px 10px 10px;
					background-color: var(--color-secondary);
					width: 100%;
					cursor: inherit;
					box-shadow: none;
					border-radius: 0;
				`}
			>
				{children}
			</select>
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
