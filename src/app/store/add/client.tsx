/** @jsxImportSource @emotion/react */
"use client";

import Button from "@/components/atoms/Button";
import Label from "@/components/atoms/Label";
import TextInput from "@/components/atoms/TextInput";
import { messagesSelector } from "@/selector/messages";
import { css } from "@emotion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSetRecoilState } from "recoil";

export default function Client(): JSX.Element {
	const [name, setName] = useState<string>("");
	const [address, setAddress] = useState<string>("");
	const setMessages = useSetRecoilState(messagesSelector);
	const router = useRouter();

	const clickButton = async (): Promise<void> => {
		try {
			const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					name,
					address
				})
			});

			if (result.status !== 200) {
				throw new Error();
			}

			const response = await result.json();
			const id = response.data.id;
			setMessages({
				status: "success",
				message: "お店を登録できました。"
			});
			router.push(`/store/${id}`);
		} catch (e) {
			setMessages({
				status: "error",
				message: "接続エラーが発生しました。"
			});
		}
	};

	return (
		<form
			css={css`
				display: flex;
				flex-direction: column;
				gap: 20px;
			`}
		>
			<div>
				<Label>名前</Label>
				<TextInput
					onChange={(e) => {
						setName(e.target.value);
					}}
				/>
			</div>
			<div>
				<Label>住所</Label>
				<TextInput
					onChange={(e) => {
						setAddress(e.target.value);
					}}
				/>
			</div>
			<div>
				<Button
					onClick={() => {
						void clickButton();
					}}
				>
					登録する
				</Button>
			</div>
		</form>
	);
}
