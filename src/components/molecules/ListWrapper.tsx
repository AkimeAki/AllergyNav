import { css } from "@kuma-ui/core";

export default function ({ children }: React.PropsWithChildren) {
	return (
		<section
			className={css`
				display: flex;
				flex-direction: column;
				gap: 20px;
			`}
		>
			{children}
		</section>
	);
}
