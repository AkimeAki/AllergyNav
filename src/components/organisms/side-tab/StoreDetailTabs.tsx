"use client";

import SideTabLink from "@/components/atoms/SideTabLink";
import { usePathname } from "next/navigation";

interface Props {
	storeId: string;
}

export default function ({ storeId }: Props): JSX.Element {
	const pathname = usePathname();

	return (
		<>
			<SideTabLink href={`/store/${storeId}`} active={pathname === `/store/${storeId}`} icon="store">
				お店情報
			</SideTabLink>
			<SideTabLink
				href={`/store/${storeId}/menu`}
				active={pathname === `/store/${storeId}/menu`}
				icon="menu_book"
			>
				アレルギー成分表
			</SideTabLink>
			<SideTabLink
				href={`/store/${storeId}/picture`}
				active={pathname === `/store/${storeId}/picture`}
				icon="image"
			>
				写真
			</SideTabLink>
			<SideTabLink
				href={`/store/${storeId}/comment`}
				active={pathname === `/store/${storeId}/comment`}
				icon="chat"
			>
				コメント
			</SideTabLink>
		</>
	);
}
