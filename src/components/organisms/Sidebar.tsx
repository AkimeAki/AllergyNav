"use client";

import { css } from "@kuma-ui/core";
import SidebarLink from "@/components/molecules/SidebarLink";
import SidebarHumberger from "@/components/molecules/SidebarHumberger";
import { useEffect, useRef, useState } from "react";

export default function (): JSX.Element {
	const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
	const sidebarRef = useRef(null);

	const sidebarCloseAreaClick = (event: MouseEvent): void => {
		if (isSidebarOpen && sidebarRef.current !== null && event.target !== sidebarRef.current) {
			setIsSidebarOpen(false);
		}
	};

	useEffect(() => {
		document.addEventListener("click", sidebarCloseAreaClick, false);

		return () => {
			document.removeEventListener("click", sidebarCloseAreaClick);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isSidebarOpen]);

	return (
		<>
			<div
				className={css`
					--sidebar-width: 330px;
					position: fixed;
					left: 0;
					bottom: 130px;
					padding-left: 40px;
					width: 100%;
					pointer-events: none;
					user-select: none;
					z-index: 9999;
				`}
			>
				<div
					className={css`
						width: 100%;
						max-width: calc(var(--sidebar-width) * 2 + 1240px);
						margin: 0 auto;
					`}
				>
					<div
						className={css`
							width: var(--sidebar-width);
						`}
					>
						<aside
							ref={sidebarRef}
							className={[
								css`
									display: flex;
									flex-direction: column;
									gap: 10px;
									padding: 25px;
									background-color: white;
									box-shadow: 0px 0px 20px -5px #969696;
									border-radius: 20px;
									transition-duration: 200ms;
									transition-property: opacity;
								`,
								isSidebarOpen
									? css`
											opacity: 1;
											user-select: auto;
											pointer-events: auto;
										`
									: css`
											opacity: 0;
											user-select: none;
											pointer-events: none;
										`
							].join(" ")}
						>
							<SidebarLink href="/">トップ</SidebarLink>
							<SidebarLink href="/store">お店一覧</SidebarLink>
							<SidebarLink href="/group">グループ一覧（未実装）</SidebarLink>
							<SidebarLink href="/login">ログイン（未実装）</SidebarLink>
						</aside>
					</div>
				</div>
			</div>
			<SidebarHumberger isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
		</>
	);
}
