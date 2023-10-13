/** @jsxImportSource @emotion/react */
"use client";

import Button from "@/components/atoms/Button";
import Label from "@/components/atoms/Label";
import SubTitle from "@/components/atoms/SubTitle";
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
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const setMessages = useSetRecoilState(messagesSelector);
	const router = useRouter();

	const clickButton = async (): Promise<void> => {
		try {
			setIsLoading(true);
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
			const id = response.data.id;
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
						readonly={isLoading}
					/>
				</div>
				<div>
					<Label>詳細</Label>
					<textarea
						onChange={(e) => {
							setDescription(e.target.value);
						}}
						css={css`
							width: 100%;
							height: 300px;
							resize: vertical;
							border-style: solid;
							border-width: 2px;
							border-color: var(--color-orange);
							margin-top: 10px;
							padding: 10px;
							transition-duration: 200ms;
							transition-property: border-color;

							&:focus {
								border-color: var(--color-green);
							}

							&[readonly] {
								background-color: #e4e4e4;
								user-select: none;
								cursor: wait;

								&:focus {
									border-color: var(--color-orange);
								}
							}
						`}
						readOnly={isLoading}
					/>
				</div>
				<div>
					<Button
						onClick={() => {
							if (!isLoading) {
								void clickButton();
							}
						}}
						loading={isLoading}
					>
						{isLoading ? "登録中…" : "登録する"}
					</Button>
				</div>
			</form>
		</div>
	);
}
