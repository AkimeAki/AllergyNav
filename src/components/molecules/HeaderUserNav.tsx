/** @jsxImportSource @emotion/react */
"use client";

import Image from "next/image";
import { css } from "@emotion/react";
import { useState } from "react";
import SidebarLink from "@/components/molecules/SidebarLink";

export default function (): JSX.Element {
	const [openNav, setOpenNav] = useState<boolean>(false);

	return (
		<>
			<div>
				<Image
					src="/default-profile.png"
					alt="プロフィールアイコン"
					width={100}
					height={100}
					onClick={() => {
						setOpenNav((status) => {
							return !status;
						});
					}}
					css={css`
						aspect-ratio: 1/1;
						width: 45px;
						border-radius: 50%;
						font-size: 20px;
						height: auto;
						vertical-align: bottom;
						cursor: pointer;
						user-select: none;
					`}
				/>
			</div>
			<nav
				css={css`
					position: absolute;
					top: 100%;
					right: 0;
					max-width: 200px;
					width: 100%;
					background-color: white;
					border-width: 2px;
					border-style: solid;
					border-color: var(--color-orange);
					border-top: none;
					opacity: ${openNav ? 1 : 0};
					user-select: ${openNav ? "auto" : "none"};
					pointer-events: ${openNav ? "auto" : "none"};
					transition-duration: 200ms;
					transition-property: opacity, user-select, pointer-events;
				`}
			>
				<SidebarLink href="/admin">管理画面</SidebarLink>
				<SidebarLink href="/logout">ログアウト</SidebarLink>
			</nav>
		</>
	);
}
