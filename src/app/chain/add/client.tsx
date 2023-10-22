/** @jsxImportSource @emotion/react */
"use client";

import Button from "@/components/atoms/Button";
import Label from "@/components/atoms/Label";
import SubTitle from "@/components/atoms/SubTitle";
import TextArea from "@/components/atoms/TextArea";
import TextInput from "@/components/atoms/TextInput";
import { messagesSelector } from "@/selector/messages";
import type { Chain } from "@/type";
import { css } from "@emotion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSetRecoilState } from "recoil";

export default function (): JSX.Element {
	const [name, setName] = useState<Chain["name"]>("");
	const [description, setDescription] = useState<Chain["description"]>("");
	const [loading, setLoading] = useState<boolean>(false);
	const setMessages = useSetRecoilState(messagesSelector);
	const router = useRouter();

	const clickButton = async (): Promise<void> => {
		try {
			setLoading(true);
			const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chain`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					name,
					description
				})
			});

			if (result.status !== 200) {
				throw new Error();
			}

			const response = await result.json();
			const id = response.id;
			setMessages({
				status: "success",
				message: "チェーン店を登録できました。"
			});
			router.push(`/chain/${id}`);
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
			`}
		>
			<SubTitle>チェーン店を追加</SubTitle>
			<form
				onSubmit={(e) => {
					e.preventDefault();
				}}
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
						disabled={loading}
					/>
				</div>
				<div>
					<Label>詳細</Label>

					<TextArea value={description} setValue={setDescription} disabled={loading} />
				</div>
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
			</form>
		</div>
	);
}
