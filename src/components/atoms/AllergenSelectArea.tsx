import { css } from "@kuma-ui/core";

interface Props {
	color: string;
	children: React.ReactNode;
	title: string;
}

export default function ({ color, children, title }: Props): JSX.Element {
	return (
		<div
			className={css`
				display: flex;
				flex-direction: column;
				gap: 5px;
			`}
		>
			<span
				className={css`
					display: block;
					text-align: center;
					font-size: 20px;
					font-weight: bold;
					user-select: none;
					pointer-events: none;
				`}
			>
				{title}
			</span>
			<div
				style={{ borderColor: color }}
				className={css`
					width: 100%;
					aspect-ratio: 1/1;
					border-style: solid;
					border-width: 10px;
					border-radius: 10px;
					background-color: #fafafa;
					padding: 10px;
				`}
			>
				{children}
			</div>
		</div>
	);
}
