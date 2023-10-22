/** @jsxImportSource @emotion/react */
"use client";

import { css } from "@emotion/react";
import { useSetRecoilState } from "recoil";
import { messagesSelector } from "@/selector/messages";
import SubTitle from "@/components/atoms/SubTitle";
import Label from "@/components/atoms/Label";
import TextInput from "@/components/atoms/TextInput";
import { useState } from "react";
import Button from "@/components/atoms/Button";
import { useRouter } from "next/navigation";

export default function (): JSX.Element {
	const setMessages = useSetRecoilState(messagesSelector);
	const [loading, setLoading] = useState<boolean>(false);
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const router = useRouter();

	const clickButton = async (): Promise<void> => {
		setLoading(true);

		if (email === "" || password === "") {
			if (email === "") {
				setMessages({
					status: "error",
					message: "メールアドレスを入力してください。"
				});
			}

			if (password === "") {
				setMessages({
					status: "error",
					message: "パスワードを入力してください。"
				});
			}

			setLoading(false);
			return;
		}

		try {
			const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/signup`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					email,
					password
				})
			});

			if (result.status !== 200) {
				throw new Error();
			}

			setMessages({
				status: "success",
				message: "新規登録できました。"
			});
			router.push("/");
		} catch (e) {
			setMessages({
				status: "error",
				message: "接続エラーが発生しました。"
			});
		}
	};

	return (
		<div
			css={css`
				display: flex;
				flex-direction: column;
				gap: 20px;
				max-width: 500px;
				width: 100%;
			`}
		>
			<SubTitle>新規登録</SubTitle>
			<form
				css={css`
					display: flex;
					flex-direction: column;
					gap: 20px;
				`}
			>
				<div>
					<Label>メールアドレス</Label>
					<TextInput
						onChange={(e) => {
							setEmail(e.target.value);
						}}
						disabled={loading}
						autoComplete="email"
					/>
				</div>
				<div>
					<Label>パスワード</Label>
					<TextInput
						password
						onChange={(e) => {
							setPassword(e.target.value);
						}}
						disabled={loading}
						autoComplete="new-password"
					/>
				</div>
			</form>
			<div>
				<Button
					onClick={() => {
						if (!loading) {
							void clickButton();
						}
					}}
					loading={loading}
				>
					{loading ? "登録中…" : "登録する"}
				</Button>
			</div>
		</div>
	);
}
