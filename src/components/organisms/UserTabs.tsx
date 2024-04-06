"use client";

import SideTabLink from "@/components/atoms/SideTabLink";
import SideTabWrapper from "@/components/molecules/SideTabWrapper";
import SideTabLinkLogout from "@/components/atoms/SideTabLinkLogout";
import { usePathname } from "next/navigation";

interface Props {
	pageId: bigint;
	userId: bigint | null;
}

export default function ({ pageId, userId }: Props): JSX.Element {
	const pathname = usePathname();

	return (
		<SideTabWrapper>
			<SideTabLink href={`/user/${pageId}`} active={pathname === `/user/${pageId}`}>
				ユーザー情報
			</SideTabLink>
			{pageId === userId && (
				<>
					<SideTabLink href="/settings" active={pathname === "/settings"}>
						設定
					</SideTabLink>
					<SideTabLinkLogout redirect="/">ログアウト</SideTabLinkLogout>
				</>
			)}
		</SideTabWrapper>
	);
}
