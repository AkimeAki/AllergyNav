import { css } from "@kuma-ui/core";

interface Props {
	cursor: string;
}

export default function ({ cursor }: Props): JSX.Element {
	return (
		<div
			style={{ cursor }}
			className={css`
				position: fixed;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				z-index: calc(infinity);
			`}
		/>
	);
}
