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
import FloatMessage from "@/components/atoms/FloatMessage";
import { useRouter, useSearchParams } from "next/navigation";

export default function (): JSX.Element {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const { response, loading, message, login } = useLogin();
	const searchParams = useSearchParams();
	const redirectPath = searchParams.get("redirect") ?? "/";
	const router = useRouter();

	useEffect(() => {
		if (response !== undefined && response) {
			router.push(redirectPath);
		}
	}, [response]);

	return (
		<>
			{loading && (
				<>
					<Cursor cursor="wait" />
					<FloatMessage type="success">ログインしています</FloatMessage>
				</>
			)}
			{message !== undefined && message.type === "error" && (
				<FloatMessage type="error">{message.text}</FloatMessage>
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
								disabled={loading}
							/>
						</div>
						<div>
							<Label>パスワード</Label>
							<TextInput
								onChange={(e) => {
									setPassword(e.target.value);
								}}
								password
								disabled={loading}
							/>
						</div>
						<Button
							onClick={() => {
								void login(email, password);
							}}
							disabled={loading}
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
