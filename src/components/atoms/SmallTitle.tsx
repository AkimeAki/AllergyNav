import { css } from "@kuma-ui/core";

export default function ({ children }: React.PropsWithChildren): JSX.Element {
	return (
		<h2
			className={css`
				font-size: 15px;
				font-weight: bold;

				* {
					font-weight: inherit;
					font-size: inherit;
					color: inherit;
				}
			`}
		>
			{children}
		</h2>
	);
}
