import { css } from "@kuma-ui/core";

interface Props {
	search: string;
}

export default function ({ search }: Props): JSX.Element {
	return (
		<>
			<iframe
				src={`https://maps.google.co.jp/maps?q=${search}&output=embed&t=m&z=17`}
				className={css`
					position: relative;
					z-index: -1;
					border: none;
					width: 100%;
					height: 400px;
					user-select: none;
				`}
			/>
		</>
	);
}
