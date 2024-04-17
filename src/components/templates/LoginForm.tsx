"use client";

import Button from "@/components/atoms/Button";
import Label from "@/components/atoms/Label";
import TextInput from "@/components/atoms/TextInput";
import { css } from "@kuma-ui/core";
import { useEffect, useState } from "react";
import SubTitle from "@/components/atoms/SubTitle";
import Link from "next/link";
import useLogin from "@/hooks/useLogin";
import Cursor from "@/components/atoms/Cursor";
import { useRouter, useSearchParams } from "next/navigation";
import { useFloatMessage } from "@/hooks/useFloatMessage";
import { isEmptyString } from "@/libs/check-string";

export default function (): JSX.Element {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const { response: loginResponse, loading: loginLoading, message: loginMessage, login } = useLogin();
	const searchParams = useSearchParams();
	const redirectPath = searchParams.get("redirect") ?? "/";
	const router = useRouter();
	const { addMessage } = useFloatMessage();

	useEffect(() => {
		if (loginResponse === true) {
			addMessage("ログインに成功しました！", "success", 3);
			router.push(redirectPath);
		}
	}, [loginResponse]);

	useEffect(() => {
		if (loginLoading) {
			addMessage("ログインしています", "success");
		}
	}, [loginLoading]);

	useEffect(() => {
		if (loginMessage !== undefined && loginMessage.type === "error") {
			addMessage(loginMessage.text, "error");
		}
	}, [loginMessage]);

	return (
		<>
			{(loginLoading || loginResponse === true) && <Cursor cursor="wait" />}
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
					<SubTitle>ログイン</SubTitle>
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
								onChange={(e) => {
									setEmail(e.target.value);
								}}
								disabled={loginLoading || loginResponse === true}
							/>
						</div>
						<div>
							<Label>パスワード</Label>
							<TextInput
								onChange={(e) => {
									setPassword(e.target.value);
								}}
								password
								disabled={loginLoading || loginResponse === true}
							/>
						</div>
						<Button
							onClick={() => {
								void login(email, password);
							}}
							disabled={
								loginLoading ||
								loginResponse === true ||
								isEmptyString(email) ||
								isEmptyString(password)
							}
						>
							ログイン
						</Button>
					</form>
				</div>
				<Link href={`/register?redirect=${redirectPath}`}>アカウント作成する場合はこちらから</Link>
			</div>
		</>
	);
}