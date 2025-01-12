"use client";

import Button from "@/components/atoms/Button";
import Label from "@/components/atoms/Label";
import TextInput from "@/components/atoms/TextInput";
import { css } from "@kuma-ui/core";
import { useEffect, useState } from "react";
import SubTitle from "@/components/atoms/SubTitle";
import { isEmptyString, checkValidPassword } from "@/libs/check-string";
import Cursor from "@/components/atoms/Cursor";
import { useFloatMessage } from "@/hooks/useFloatMessage";
import useChangePassword from "@/hooks/fetch-api/useChangePassword";
import { signOut } from "next-auth/react";

interface Props {
	recoveryCode: string;
}

export default function ({ recoveryCode }: Props): JSX.Element {
	const [password, setPassword] = useState<string>("");
	const [confirmPassword, setConfirmPassword] = useState<string>("");
	const { changePasswordStatus, changePassword } = useChangePassword();
	const { addMessage } = useFloatMessage();
	const [notAllowedString, setNotAllowedString] = useState<string>("");

	useEffect(() => {
		const result = checkValidPassword(password);
		if (result.status === "not allowed") {
			setNotAllowedString(result.message);
		} else {
			setNotAllowedString("");
		}
	}, [password]);

	useEffect(() => {
		if (changePasswordStatus === "loading") {
			addMessage("入力データを送信しています", "success");
		}

		if (changePasswordStatus === "failed") {
			addMessage("パスワード変更処理に失敗しました", "error");
		}

		if (changePasswordStatus === "successed") {
			addMessage("パスワード変更完了しました。ログインし直してください。", "success");
			void signOut({
				redirect: true,
				callbackUrl: "/login"
			});
		}
	}, [changePasswordStatus]);

	return (
		<>
			{changePasswordStatus === "loading" && <Cursor cursor="wait" />}
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
					<SubTitle>パスワード変更</SubTitle>
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
							<Label>パスワード</Label>
							<TextInput
								password
								value={password}
								disabled={changePasswordStatus === "loading"}
								loading={changePasswordStatus === "loading"}
								onChange={(e) => {
									setPassword(e.target.value);
								}}
							/>
							<span
								className={css`
									font-size: 15px;
									display: block;
								`}
							>
								※最大60文字
							</span>
							<span
								className={css`
									font-size: 15px;
									display: block;
								`}
							>
								※大小英数字記号を使用可能
							</span>
							{notAllowedString !== "" && (
								<span
									className={css`
										font-size: 15px;
										display: block;
										color: var(--color-red);
									`}
								>
									※
									{(() => {
										const segmenter = new Intl.Segmenter("ja-JP");
										const target = notAllowedString;

										let text = "";
										Array.from(segmenter.segment(target)).map((data) => {
											text += `「${data.segment}」`;
										});

										return text;
									})()}
									は使用できません。
								</span>
							)}
							{checkValidPassword(password).status === "long" && (
								<span
									className={css`
										font-size: 15px;
										display: block;
										color: var(--color-red);
									`}
								>
									※文字数オーバーです。
								</span>
							)}
						</div>
						<div>
							<Label>パスワード（確認）</Label>
							<span
								className={css`
									font-size: 15px;
									display: block;
								`}
							>
								もう一度パスワードを入力してください。
							</span>
							<TextInput
								password
								value={confirmPassword}
								disabled={changePasswordStatus === "loading"}
								loading={changePasswordStatus === "loading"}
								onChange={(e) => {
									setConfirmPassword(e.target.value);
								}}
							/>
						</div>
						<Button
							onClick={() => {
								changePassword(recoveryCode, password);
							}}
							disabled={
								password !== confirmPassword ||
								isEmptyString(password) ||
								changePasswordStatus === "loading" ||
								checkValidPassword(password).status !== "success"
							}
							loading={changePasswordStatus === "loading"}
						>
							パスワードを変更
						</Button>
					</form>
				</div>
			</div>
		</>
	);
}
