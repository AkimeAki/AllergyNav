"use client";

import SideTabLink from "@/components/atoms/SideTabLink";
import SideTabWrapper from "@/components/molecules/SideTabWrapper";
import SideTabLinkLogout from "@/components/atoms/SideTabLinkLogout";
import { usePathname } from "next/navigation";

interface Props {
	pageId: string;
	userId: string | null;
}

export default function ({ pageId, userId }: Props): JSX.Element {
	const pathname = usePathname();

	return (
		<SideTabWrapper>
			<SideTabLink icon="person" href={`/user/${pageId}`} active={pathname === `/user/${pageId}`}>
				ユーザー情報
			</SideTabLink>
			{pageId === userId && (
				<>
					<SideTabLink icon="favorite" href="/user/favorites" active={pathname === "/user/favorites"}>
						お気に入り
					</SideTabLink>
					<SideTabLink icon="history" href="/user/histories" active={pathname === "/user/histories"}>
						履歴
					</SideTabLink>
					<SideTabLink icon="settings" href="/user/settings" active={pathname === "/user/settings"}>
						設定
					</SideTabLink>
					<SideTabLinkLogout redirect="/">ログアウト</SideTabLinkLogout>
				</>
			)}
		</SideTabWrapper>
	);
}
