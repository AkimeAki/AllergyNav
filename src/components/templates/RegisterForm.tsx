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
import FloatMessage from "@/components/atoms/FloatMessage";
import useLogin from "@/hooks/useLogin";

export default function (): JSX.Element {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [confirmPassword, setConfirmPassword] = useState<string>("");
	const { response: addUserResponse, loading: addUserLoading, message: addUserMessage, addUser } = useAddUser();
	const { response: loginResponse, loading: loginLoading, login } = useLogin();
	const searchParams = useSearchParams();
	const redirectPath = searchParams.get("redirect") ?? "";

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

	return (
		<>
			{addUserLoading && <FloatMessage type="success">入力データを送信しています</FloatMessage>}
			{(addUserLoading || loginLoading) && <Cursor cursor="wait" />}
			{addUserMessage !== undefined && addUserMessage.type === "error" && (
				<FloatMessage type="error">{addUserMessage.text}</FloatMessage>
			)}
			{loginResponse !== undefined && !loginResponse && (
				<FloatMessage type="error">アカウント作成処理に失敗しました</FloatMessage>
			)}
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
