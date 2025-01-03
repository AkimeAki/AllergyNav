import type { ReactNode } from "react";
import { css } from "@kuma-ui/core";
import StoreDetailTabs from "@/components/organisms/StoreDetailTabs";
import { getStore } from "@/libs/server-fetch";
import LoadingCircleCenter from "@/components/atoms/LoadingCircleCenter";

interface Props {
	children: ReactNode;
	params: {
		id: string;
	};
}

export default async function ({ children, params }: Props): Promise<JSX.Element> {
	const storeDetail = await getStore(params.id);

	return (
		<>
			<StoreDetailTabs storeId={storeDetail.id} />
			<div
				className={css`
					display: none;

					@media (max-width: 880px) {
						display: block;
						margin-top: 40px;
					}

					@media (max-width: 600px) {
						margin-top: 60px;
					}
				`}
			>
				<h2
					className={css`
						font-size: 25px;
						font-weight: bold;

						body[data-swipe-loading="true"] & {
							display: none;
						}
					`}
				>
					{storeDetail.name}
				</h2>
			</div>
			<div
				className={css`
					position: relative;
					width: 100%;
					overflow-x: hidden;
					overflow-y: hidden;
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
						gap: 30px;
						transition-duration: 100ms;
						transition-property: transform;
					`}
				>
					<div
						className={css`
							@media (max-width: 880px) {
								display: none;
							}
						`}
					>
						<h2
							className={css`
								font-size: 25px;
								font-weight: bold;
							`}
						>
							{storeDetail.name}
						</h2>
					</div>
					<div>{children}</div>
				</div>
			</div>
		</>
	);
}
