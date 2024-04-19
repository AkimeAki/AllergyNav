"use client";

import Button from "@/components/atoms/Button";
import Label from "@/components/atoms/Label";
import TextInput from "@/components/atoms/TextInput";
import { css } from "@kuma-ui/core";
import { useEffect, useState } from "react";
import SubTitle from "@/components/atoms/SubTitle";
import Link from "next/link";
import useAddUser from "@/hooks/useAddUser";
import { isEmailString, isEmptyString } from "@/libs/check-string";
import { useSearchParams, redirect } from "next/navigation";
import Cursor from "@/components/atoms/Cursor";
import useLogin from "@/hooks/useLogin";
import { useFloatMessage } from "@/hooks/useFloatMessage";

export default function (): JSX.Element {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [confirmPassword, setConfirmPassword] = useState<string>("");
	const { response: addUserResponse, loading: addUserLoading, message: addUserMessage, addUser } = useAddUser();
	const { response: loginResponse, loading: loginLoading, login } = useLogin();
	const searchParams = useSearchParams();
	const redirectPath = searchParams.get("redirect") ?? "";
	const { addMessage } = useFloatMessage();

	useEffect(() => {
		if (addUserResponse !== undefined && addUserResponse !== null) {
			void login(email, password);
		}
	}, [addUserResponse]);

	useEffect(() => {
		if (loginResponse !== undefined && loginResponse) {
			redirect(redirectPath);
		}
	}, [loginResponse]);

	useEffect(() => {
		if (addUserLoading) {
			addMessage("入力データを送信しています", "success");
		}
	}, [addUserLoading]);

	useEffect(() => {
		if (loginResponse !== undefined && !loginResponse) {
			addMessage("アカウント作成処理に失敗しました", "error");
		}
	}, [loginResponse]);

	useEffect(() => {
		if (addUserMessage !== undefined && addUserMessage.type === "error") {
			addMessage(addUserMessage.text, "error");
		}
	}, [addUserMessage]);

	return (
		<>
			{(addUserLoading || loginLoading) && <Cursor cursor="wait" />}
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
					<SubTitle>アカウント作成</SubTitle>
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
								disabled={addUserLoading || loginLoading}
								onChange={(e) => {
									setEmail(e.target.value);
								}}
							/>
						</div>
						<div>
							<Label>パスワード</Label>
							<TextInput
								password
								value={password}
								disabled={addUserLoading || loginLoading}
								onChange={(e) => {
									setPassword(e.target.value);
								}}
							/>
						</div>
						<div>
							<Label>パスワード（確認）</Label>
							<TextInput
								password
								value={confirmPassword}
								disabled={addUserLoading || loginLoading}
								onChange={(e) => {
									setConfirmPassword(e.target.value);
								}}
							/>
						</div>
						<Button
							onClick={() => {
								void addUser(email, password);
							}}
							disabled={
								password !== confirmPassword ||
								isEmptyString(password) ||
								!isEmailString(email) ||
								addUserLoading ||
								loginLoading
							}
						>
							アカウントを作成
						</Button>
					</form>
				</div>
				<Link href={`/login?redirect=${redirectPath}`}>アカウント作成済みの方はこちらからログイン</Link>
			</div>
		</>
	);
}
