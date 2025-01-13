"use client";

import { css } from "@kuma-ui/core";
import Button from "@/components/atoms/Button";
import useGetUserData from "@/hooks/useGetUserData";
import useSendVerifyMail from "@/hooks/fetch-api/useSendVerifyMail";
import { useEffect, useRef } from "react";

export default function (): JSX.Element {
	const { userId, userVerified } = useGetUserData();
	const { sendVerifyMail, sendVerifyMailStatus } = useSendVerifyMail();
	const element = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const resize = () => {
			if (element.current !== null) {
				document.body.style.setProperty("--top-space", String(element.current.offsetHeight) + "px");
			}
		};

		if (!userVerified) {
			resize();
			window.addEventListener("resize", resize);
		}

		return () => {
			window.removeEventListener("resize", resize);
		};
	}, [userVerified]);

	return (
		<>
			{userVerified === false && (
				<div
					ref={element}
					className={css`
						position: fixed;
						top: 0;
						left: 0;
						width: 100%;
						z-index: 10001;
						background-color: var(--color-theme);
					`}
				>
					<div
						className={css`
							max-width: 1200px;
							margin: 0 auto;
							width: 100%;
							padding: 5px 30px;
							display: flex;
							align-items: center;
							flex-wrap: wrap;
							gap: 3px;
						`}
					>
						<span
							className={css`
								color: white;
								font-weight: bold;
							`}
						>
							メール認証が完了していません。アカウント作成日から7日後にアカウントが削除されます。
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
		</>
	);
}
