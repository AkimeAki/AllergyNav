import type { ReactNode } from "react";
import { css } from "@kuma-ui/core";
import SideTabWrapper from "@/components/molecules/SideTabWrapper";
import LoadingCircleCenter from "@/components/atoms/LoadingCircleCenter";

interface Props {
	children: ReactNode;
	sideTabLinks: ReactNode;
}

export default async function ({ children, sideTabLinks }: Props): Promise<JSX.Element> {
	return (
		<>
			<SideTabWrapper>{sideTabLinks}</SideTabWrapper>
			<div
				className={css`
					position: relative;
					width: 100%;
					overflow-x: hidden;
					overflow-y: hidden;

					@media (max-width: 880px) {
						margin-top: 50px;
					}

					@media (max-width: 600px) {
						margin-top: 70px;
					}
				`}
			>
				<div
					className={css`
						position: absolute;
						top: 0;
						left: 0;
						width: 100%;
						display: none;
						z-index: -1;

						body[data-swipe-loading="true"] & {
							display: block;
						}
					`}
				>
					<LoadingCircleCenter />
				</div>
				<div
					id="side-tab-contents"
					className={css`
						display: flex;
						flex-direction: column;
						gap: 20px;
						transition-duration: 100ms;
						transition-property: transform;
					`}
				>
					{children}
				</div>
			</div>
		</>
	);
}
