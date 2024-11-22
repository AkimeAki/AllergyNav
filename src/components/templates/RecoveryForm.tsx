"use client";

import Button from "@/components/atoms/Button";
import Label from "@/components/atoms/Label";
import TextInput from "@/components/atoms/TextInput";
import { css } from "@kuma-ui/core";
import { useEffect, useState } from "react";
import SubTitle from "@/components/atoms/SubTitle";
import Link from "next/link";
import useAddUser from "@/hooks/fetch-api/useAddUser";
import { isEmailString, isEmptyString, checkValidPassword } from "@/libs/check-string";
import { useSearchParams } from "next/navigation";
import Cursor from "@/components/atoms/Cursor";
import useLogin from "@/hooks/useLogin";
import { useFloatMessage } from "@/hooks/useFloatMessage";

export default function (): JSX.Element {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [confirmPassword, setConfirmPassword] = useState<string>("");
	const { addUserResponse, addUserStatus, addUser } = useAddUser();
	const { response: loginResponse, loading: loginLoading, login } = useLogin();
	const searchParams = useSearchParams();
	const redirectPath = searchParams.get("redirect") ?? "";
	const { addMessage } = useFloatMessage();
	const [notAllowedString, setNotAllowedString] = useState<string>("");

	useEffect(() => {
		if (addUserResponse !== undefined && addUserResponse !== null) {
			void login(email, password);
		}
	}, [addUserResponse]);

	useEffect(() => {
		if (loginResponse !== undefined && loginResponse) {
			window.location.href = redirectPath;
		}
	}, [loginResponse]);

	useEffect(() => {
		const result = checkValidPassword(password);
		if (result.status === "not allowed") {
			setNotAllowedString(result.message);
		} else {
			setNotAllowedString("");
		}
	}, [password]);

	useEffect(() => {
		if (addUserStatus === "loading") {
			addMessage("入力データを送信しています", "success");
		}

		if (addUserStatus === "failed") {
			addMessage("アカウント作成処理に失敗しました", "error");
		}
	}, [addUserStatus]);

	return (
		<>
			{(addUserStatus === "loading" || loginLoading) && <Cursor cursor="wait" />}
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
								disabled={addUserStatus === "loading" || loginLoading}
								loading={addUserStatus === "loading" || loginLoading}
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
								addUser(email, password);
							}}
							disabled={
								password !== confirmPassword ||
								isEmptyString(password) ||
								!isEmailString(email) ||
								addUserStatus === "loading" ||
								loginLoading ||
								checkValidPassword(password).status !== "success"
							}
							loading={addUserStatus === "loading" || loginLoading}
						>
							パスワード再設定メールを送信
						</Button>
					</form>
				</div>
				<Link aria-label="ログインページ" href={`/login?redirect=${redirectPath}`}>
					ログインはこちらから
				</Link>
			</div>
		</>
	);
}
