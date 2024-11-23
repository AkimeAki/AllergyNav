"use client";

import Button from "@/components/atoms/Button";
import Label from "@/components/atoms/Label";
import TextInput from "@/components/atoms/TextInput";
import { css } from "@kuma-ui/core";
import { useEffect, useState } from "react";
import SubTitle from "@/components/atoms/SubTitle";
import Link from "next/link";
import { isEmailString, isEmptyString } from "@/libs/check-string";
import Cursor from "@/components/atoms/Cursor";
import { useFloatMessage } from "@/hooks/useFloatMessage";
import useSendRecoveryMail from "@/hooks/fetch-api/useSendRecoveryMail";

export default function (): JSX.Element {
	const [email, setEmail] = useState<string>("");
	const { sendRecoveryMail, sendRecoveryMailStatus } = useSendRecoveryMail();
	const { addMessage } = useFloatMessage();

	useEffect(() => {
		console.log(sendRecoveryMailStatus);

		if (sendRecoveryMailStatus === "loading") {
			addMessage("入力データを送信しています", "success");
		}

		if (sendRecoveryMailStatus === "failed") {
			addMessage("パスワード再設定メールの送信に失敗しました", "error");
		}

		if (sendRecoveryMailStatus === "successed") {
			addMessage("パスワード再設定メールを送信しました", "success");
		}
	}, [sendRecoveryMailStatus]);

	return (
		<>
			{sendRecoveryMailStatus === "loading" && <Cursor cursor="wait" />}
			<div
				className={css`
					display: flex;
					flex-direction: column;
					gap: 20px;
				`}
			>
				<div
					className={css`
						box-shadow: 0 0 10px -5px #969696;
						padding: 30px;
						border-radius: 20px;
					`}
				>
					<SubTitle>パスワード再設定</SubTitle>
					<form
						className={css`
							display: flex;
							flex-direction: column;
							gap: 20px;
							margin-top: 30px;
							padding: 0 10px;

							& > div {
								display: flex;
								align-items: flex-start;
								flex-direction: column;
								gap: 10px;
							}
						`}
					>
						<div>
							<Label>メールアドレス</Label>
							<TextInput
								value={email}
								disabled={sendRecoveryMailStatus === "loading"}
								loading={sendRecoveryMailStatus === "loading"}
								onChange={(e) => {
									setEmail(e.target.value);
								}}
							/>
							<span
								className={css`
									font-size: 15px;
									display: block;
								`}
							>
								※パスワードを再設定したいアカウントのメールアドレスを入力してください。
							</span>
							{!isEmptyString(email) && !isEmailString(email) && (
								<span
									className={css`
										font-size: 15px;
										display: block;
										color: var(--color-red);
									`}
								>
									※メールアドレスの形式ではありません。
								</span>
							)}
						</div>
						<Button
							onClick={() => {
								sendRecoveryMail(email);
							}}
							disabled={!isEmailString(email) || sendRecoveryMailStatus === "loading"}
							loading={sendRecoveryMailStatus === "loading"}
						>
							パスワード再設定メールを送信
						</Button>
					</form>
				</div>
				<Link aria-label="ログインページ" href="/login">
					ログインはこちらから
				</Link>
			</div>
		</>
	);
}
