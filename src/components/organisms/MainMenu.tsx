"use client";

import { css } from "@kuma-ui/core";
import MainMenuLink from "@/components/atoms/MainMenuLink";
import MainMenuHumberger from "@/components/molecules/MainMenuHumberger";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import useGetUserData from "@/hooks/useGetUserData";
import MainMenuLinkLoading from "@/components/atoms/MainMenuLinkLoading";
import { cx } from "@/libs/merge-kuma";

export default function (): JSX.Element {
	const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
	const sidebarRef = useRef(null);
	const pathname = usePathname();
	const { userStatus, userId, userRole } = useGetUserData();

	useEffect(() => {
		setIsSidebarOpen(false);
	}, [pathname]);

	return (
		<>
			<div
				onClick={() => {
					setIsSidebarOpen(false);
				}}
				className={cx(
					css`
						position: fixed;
						top: 0;
						left: 0;
						z-index: 100000;
						width: 100%;
						height: 100%;
						transition-duration: 200ms;
						transition-property: opacity;

						@media (max-width: 880px) {
							background-color: var(--color-modal-bg);
						}
					`,
					isSidebarOpen
						? css`
								opacity: 0.4;
								user-select: auto;
								pointer-events: auto;
							`
						: css`
								opacity: 0;
								user-select: none;
								pointer-events: none;
							`
				)}
			/>
			<div
				className={css`
					--sidebar-width: 330px;
					position: fixed;
					left: 0;
					bottom: 130px;
					padding-left: 30px;
					width: 100%;
					pointer-events: none;
					user-select: none;
					z-index: 100000;

					@media (max-width: 600px) {
						bottom: 110px;
						padding-left: 20px;
					}

					@media (max-width: calc(330px + (40px * 2))) {
						padding-left: 10px;
						padding-right: 10px;
						--sidebar-width: 100%;
					}
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
							max-width: 100%;
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
									background-color: var(--color-secondary);
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
							<MainMenuLink href="/" active={pathname === "/"}>
								トップ
							</MainMenuLink>
							<MainMenuLink href="/store" active={pathname === "/store"}>
								お店
							</MainMenuLink>
							<MainMenuLink active={pathname === "/vendor"}>自販機（未実装）</MainMenuLink>
							<MainMenuLink active={pathname === "/food"}>商品（未実装）</MainMenuLink>
							{userStatus === "loading" && <MainMenuLinkLoading />}
							{userStatus === "authenticated" && userId !== null && (
								<MainMenuLink
									href={`/user/${userId}`}
									active={
										pathname === `/user/${userId}` ||
										pathname.startsWith(`/user/${userId}/`) ||
										pathname === "/settings"
									}
								>
									マイページ
								</MainMenuLink>
							)}
							{userStatus === "authenticated" && userRole === "admin" && (
								<MainMenuLink
									href="/admin"
									active={pathname === "/admin" || pathname.startsWith("/admin/")}
								>
									管理画面
								</MainMenuLink>
							)}
							{userStatus === "unauthenticated" && (
								<MainMenuLink
									href={`/login?redirect=${pathname}`}
									active={pathname === "/login" || pathname === "/register"}
								>
									ログイン / アカウント作成
								</MainMenuLink>
							)}
						</aside>
					</div>
				</div>
			</div>
			<MainMenuHumberger isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
		</>
	);
}
