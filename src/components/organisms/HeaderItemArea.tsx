import { css } from "@kuma-ui/core";

interface Props {
	children: React.ReactNode;
}

export default function ({ children }: Props): JSX.Element {
	return (
		<aside
			className={css`
				position: fixed;
				top: 0;
				left: 0;
				width: 100%;
				height: 80px;
				z-index: 10000;
				user-select: none;
				pointer-events: none;

				@media (max-width: 880px) {
					height: 60px;
				}
			`}
		>
			<div
				className={css`
					display: flex;
					position: relative;
					align-items: center;
					justify-content: flex-end;
					width: 100%;
					max-width: 1200px;
					margin: 0 auto;
					padding: 0 30px;
					height: 100%;
					gap: 20px;

					* {
						user-select: auto;
						pointer-events: auto;
					}

					@media (max-width: 600px) {
						padding: 0 10px;
					}
				`}
			>
				{children}
			</div>
		</aside>
	);
}
