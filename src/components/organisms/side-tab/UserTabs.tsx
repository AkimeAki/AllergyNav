"use client";

import SideTabLink from "@/components/atoms/SideTabLink";
import SideTabLinkLogout from "@/components/atoms/SideTabLinkLogout";
import { usePathname } from "next/navigation";

interface Props {
	pageId: string;
	currentUserId: string | null;
}

export default function ({ pageId, currentUserId }: Props): JSX.Element {
	const pathname = usePathname();

	return (
		<>
			<SideTabLink icon="person" href={`/user/${pageId}`} active={pathname === `/user/${pageId}`}>
				ユーザー情報
			</SideTabLink>
			{pageId === currentUserId && (
				<>
					<SideTabLink icon="favorite" href="/favorites" active={pathname === "/favorites"}>
						お気に入り
					</SideTabLink>
					<SideTabLink icon="history" href="/histories" active={pathname === "/histories"}>
						閲覧履歴
					</SideTabLink>
					<SideTabLink icon="settings" href="/settings" active={pathname === "/settings"}>
						設定
					</SideTabLink>
					<SideTabLinkLogout redirect="/">ログアウト</SideTabLinkLogout>
				</>
			)}
		</>
	);
}
