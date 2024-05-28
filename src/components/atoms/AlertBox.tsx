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
			`}
		>
			{children}
		</div>
	);
}
