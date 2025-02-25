"use client";

import SideTabLink from "@/components/atoms/SideTabLink";
import SideTabLinkLogout from "@/components/atoms/SideTabLinkLogout";
import { usePathname } from "next/navigation";

export default function (): JSX.Element {
	const pathname = usePathname();

	return (
		<>
			<SideTabLink href="/admin" active={pathname === "/admin"} icon="shield_person">
				トップ
			</SideTabLink>
			<SideTabLink
				href="/admin/store"
				active={pathname === "/admin/store" || pathname.startsWith("/admin/store/")}
				icon="store"
			>
				お店管理
			</SideTabLink>
			<SideTabLink
				href="/admin/menu"
				active={pathname === "/admin/menu" || pathname.startsWith("/admin/menu/")}
				icon="menu_book"
			>
				メニュー管理
			</SideTabLink>
			<SideTabLink
				href="/admin/user"
				active={pathname === "/admin/user" || pathname.startsWith("/admin/user/")}
				icon="person"
			>
				ユーザー管理
			</SideTabLink>
			<SideTabLinkLogout redirect="/">ログアウト</SideTabLinkLogout>
		</>
	);
}
