import { css } from "@kuma-ui/core";

export default function ({ children }: React.PropsWithChildren) {
	return (
		<div
			className={css`
				position: relative;
				transition-duration: 200ms;
				transition-property: box-shadow;
				overflow: hidden;
				border-radius: 7px;
				border-width: 2px;
				border-style: solid;
				border-color: #f3f3f3;
			`}
		>
			{children}
		</div>
	);
}
