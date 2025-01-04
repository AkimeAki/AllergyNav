import { css } from "@kuma-ui/core";

interface Props {
	search: string;
}

export default function ({ search }: Props): JSX.Element {
	return (
		<>
			<iframe
				title="Googleマップ"
				src={`https://maps.google.co.jp/maps?q=${encodeURIComponent(search)}&output=embed&t=m&z=17`}
				className={css`
					position: relative;
					border: none;
					width: 100%;
					height: 400px;
				`}
			/>
		</>
	);
}
