import { css } from "@kuma-ui/core";

interface Props {
	children: React.ReactNode;
}

export default function ({ children }: Props): JSX.Element {
	return (
		<div
			className={css`
				border: 4px solid var(--color-theme);
				padding: 10px;
				background-color: var(--color-theme-thin);
				border-radius: 10px;
				display: flex;
				flex-direction: column;
				gap: 5px;
				font-size: 17px;

				@media (max-width: 880px) {
					padding: 7px;
					font-size: 14px;
					* {
						font-size: 14px;
					}
				}
			`}
		>
			{children}
		</div>
	);
}
