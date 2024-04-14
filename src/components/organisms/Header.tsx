"use client";

import { css } from "@kuma-ui/core";
import Link from "next/link";
import Image from "next/image";
import { SessionProvider } from "next-auth/react";
import useGetUserData from "@/hooks/useGetUserData";
import Button from "@/components/atoms/Button";
import useSendVerifyMail from "@/hooks/useSendVerifyMail";

const Header = (): JSX.Element => {
	const { userId, userVerified } = useGetUserData();
	const { sendVerifyMail, response } = useSendVerifyMail();

	return (
		<>
			{userVerified === false && (
				<div
					className={css`
						background-color: var(--color-orange);
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
						{response === undefined && userId !== null && (
							<Button
								size="tiny"
								color="var(--color-black)"
								onClick={() => {
									void sendVerifyMail(userId);
								}}
							>
								認証メールを再送信する
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
								width={340}
								height={250}
								className={css`
									aspect-ratio: 340/250;
									width: 50px;
									font-size: 20px;
									height: auto;
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
};

export default function (): JSX.Element {
	return (
		<SessionProvider>
			<Header />
		</SessionProvider>
	);
}
