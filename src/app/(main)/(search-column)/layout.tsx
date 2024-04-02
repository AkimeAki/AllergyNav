import type { ReactNode } from "react";
import { css } from "@kuma-ui/core";
import StoreListSidebar from "@/components/organisms/StoreListSidebar";

interface Props {
	children: ReactNode;
}

export default function ({ children }: Props): JSX.Element {
	return (
		<div
			className={css`
				display: grid;
				grid-template-columns: 300px 1fr;
				gap: 10px;

				@media (max-width: 960px) {
					grid-template-columns: 220px 1fr;
				}

				@media (max-width: 880px) {
					grid-template-columns: 1fr;
				}
			`}
		>
			<StoreListSidebar />
			{children}
		</div>
	);
}
