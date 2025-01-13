"use client";

import Button from "@/components/atoms/Button";
import Label from "@/components/atoms/Label";
import { css } from "@kuma-ui/core";
import { useEffect, useState } from "react";
import SubTitle from "@/components/atoms/SubTitle";
import Link from "next/link";
import useLogin from "@/hooks/useLogin";
import Cursor from "@/components/atoms/Cursor";
import { useSearchParams } from "next/navigation";
import { useFloatMessage } from "@/hooks/useFloatMessage";
import { isEmptyString } from "@/libs/check-string";
import InputText from "@/components/atoms/InputText";

export default function (): JSX.Element {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const { response: loginResponse, loading: loginLoading, message: loginMessage, login } = useLogin();
	const searchParams = useSearchParams();
	const redirectPath = searchParams.get("redirect") ?? "/";
	const { addMessage } = useFloatMessage();
	const [isLoginPossible, setIsLoginPossible] = useState<boolean>(false);

	useEffect(() => {
		if (loginResponse === true) {
			addMessage("ログインに成功しました！", "success", "path");
			window.location.href = redirectPath;
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

	useEffect(() => {
		if (!(loginLoading || loginResponse === true || isEmptyString(email) || isEmptyString(password))) {
			setIsLoginPossible(true);
		} else {
			setIsLoginPossible(false);
		}
	}, [loginLoading, loginResponse, email, password]);

	return (
		<div
			className={css`
				width: 100%;
				max-width: 500px;
				margin: 0 auto;
			`}
		>
			<div>
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
								<InputText
									value={email}
									onChange={(e) => {
										setEmail(e.target.value);
									}}
									disabled={loginLoading || loginResponse === true}
								/>
							</div>
							<div>
								<Label>パスワード</Label>
								<InputText
									value={password}
									onChange={(e) => {
										setPassword(e.target.value);
									}}
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											if (isLoginPossible) {
												void login(email, password);
											}
										}
									}}
									password
									disabled={loginLoading || loginResponse === true}
								/>
							</div>
							<Button
								onClick={() => {
									void login(email, password);
								}}
								disabled={!isLoginPossible}
							>
								ログイン
							</Button>
						</form>
					</div>
					<Link aria-label="アカウント作成ページ" href={`/register?redirect=${redirectPath}`}>
						アカウント作成する場合はこちらから
					</Link>
					<Link aria-label="パスワード再設定ページ" href="/recovery">
						パスワードを忘れた方はこちらから
					</Link>
				</div>
			</div>
		</div>
	);
}
