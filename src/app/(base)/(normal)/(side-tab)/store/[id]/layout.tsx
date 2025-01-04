import type { ReactNode } from "react";
import { css } from "@kuma-ui/core";
import StoreDetailTabs from "@/components/organisms/side-tab/StoreDetailTabs";
import { getStore } from "@/libs/server-fetch";
import SideTabLayout from "@/components/templates/SideTabLayout";

interface Props {
	children: ReactNode;
	params: {
		id: string;
	};
}

export default async function ({ children, params }: Props): Promise<JSX.Element> {
	const storeDetail = await getStore(params.id);

	return (
		<SideTabLayout sideTabLinks={<StoreDetailTabs storeId={storeDetail.id} />}>
			<h2
				className={css`
					font-size: 25px;
					font-weight: bold;
				`}
			>
				{storeDetail.name}
			</h2>
			<div>{children}</div>
		</SideTabLayout>
	);
}
