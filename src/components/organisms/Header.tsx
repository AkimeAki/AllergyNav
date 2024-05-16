"use client";

import { css } from "@kuma-ui/core";
import Link from "next/link";
import Image from "next/image";
import useGetUserData from "@/hooks/useGetUserData";
import Button from "@/components/atoms/Button";
import useSendVerifyMail from "@/hooks/fetch-api/useSendVerifyMail";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function (): JSX.Element {
	const { userId, userVerified } = useGetUserData();
	const { sendVerifyMail, sendVerifyMailStatus } = useSendVerifyMail();
	const pathname = usePathname();

	useEffect(() => {
		const root = document.querySelector("#root") as HTMLDivElement;
		root.scrollTo(0, 0);
	}, [pathname]);

	return (
		<>
			{userVerified === false && (
				<div
					className={css`
						background-color: var(--color-theme);
					`}
				>
					<div
						className={css`
							max-width: 1200px;
							margin: 0 auto;
							width: 100%;
							padding: 0 30px;
							height: 40px;
							display: flex;
							align-items: center;
						`}
					>
						<span
							className={css`
								color: white;
							`}
						>
							メール認証が完了していません。7日後にアカウントが削除されます。
						</span>
						{sendVerifyMailStatus === "yet" && (
							<Button
								size="tiny"
								color="var(--color-primary)"
								onClick={() => {
									sendVerifyMail(userId ?? "");
								}}
							>
								認証メールを再送信する
							</Button>
						)}
						{sendVerifyMailStatus === "loading" && (
							<Button size="tiny" disabled>
								送信中
							</Button>
						)}
						{sendVerifyMailStatus === "successed" && (
							<Button size="tiny" disabled>
								認証メールを送信しました
							</Button>
						)}
					</div>
				</div>
			)}
			<header
				className={css`
					width: 100%;
					height: 140px;
					z-index: 10;

					@media (max-width: 880px) {
						height: 60px;
					}
				`}
			>
				<div
					className={css`
						display: flex;
						position: relative;
						align-items: center;
						justify-content: space-between;
						width: 100%;
						max-width: 1200px;
						margin: 0 auto;
						padding: 0 30px;
						height: 100%;
					`}
				>
					<h1
						className={css`
							display: flex;
							align-items: center;
						`}
					>
						<Link
							href="/"
							className={css`
								display: flex;
								align-items: center;
								text-decoration: none;
								height: 100%;
								gap: 10px;
							`}
						>
							<Image
								src="/icons/allergy-nav.png"
								alt="アイコン"
								width={256}
								height={269}
								className={css`
									aspect-ratio: 256/269;
									width: auto;
									font-size: 20px;
									height: 40px;
								`}
							/>
							<div
								className={css`
									font-weight: 700;
								`}
							>
								アレルギーナビ
								<span
									className={css`
										font-weight: 700;
										margin-left: 5px;

										@media (max-width: 430px) {
											display: none;
										}
									`}
								>
									超β版
								</span>
							</div>
						</Link>
					</h1>
				</div>
			</header>
		</>
	);
}
