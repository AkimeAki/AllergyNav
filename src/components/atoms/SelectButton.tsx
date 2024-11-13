import { css } from "@kuma-ui/core";
import { ReactNode } from "react";

interface Props {
	children: ReactNode;
	onClick?: () => void;
	disabled?: boolean;
}

export default function ({ children, onClick, disabled }: Props) {
	return (
		<button
			onClick={() => {
				if (onClick !== undefined) {
					onClick();
				}
			}}
			className={[
				css`
					cursor: pointer;
					user-select: none;
					border: 2px solid var(--color-hide);
					border-radius: 7px;
					padding: 10px;
					font-size: 17px;
					background-color: transparent;
					transition-duration: 200ms;
					transition-property: background-color;
					white-space: nowrap;

					@media (max-width: 600px) {
						font-size: 15px;
						padding: 5px;
					}
				`,
				disabled
					? css`
							background-color: var(--color-theme-thin);
							border-color: var(--color-theme);
					  `
					: ""
			].join(" ")}
		>
			{children}
		</button>
	);
}
