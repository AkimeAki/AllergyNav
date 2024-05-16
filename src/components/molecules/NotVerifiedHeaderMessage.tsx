"use client";

import { css } from "@kuma-ui/core";
import Button from "@/components/atoms/Button";
import useGetUserData from "@/hooks/useGetUserData";
import useSendVerifyMail from "@/hooks/fetch-api/useSendVerifyMail";

export default function (): JSX.Element {
	const { userId, userVerified } = useGetUserData();
	const { sendVerifyMail, sendVerifyMailStatus } = useSendVerifyMail();

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
		</>
	);
}
