/** @jsxImportSource @emotion/react */
"use client";

import Button from "@/components/atoms/Button";
import Label from "@/components/atoms/Label";
import TextInput from "@/components/atoms/TextInput";
import { messagesSelector } from "@/selector/messages";
import type { Message, Store } from "@/type";
import { css } from "@emotion/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";

interface Props {
	id: number;
}

export default function ({ id }: Props): JSX.Element {
	const [name, setName] = useState<Store["name"]>("");
	const [address, setAddress] = useState<Store["address"]>("");
	const [description, setDescription] = useState<Store["description"]>("");
	const [isLoading, setIsLoading] = useState(true);
	const [isSendLoading, setIsSendLoading] = useState(false);
	const setMessages = useSetRecoilState(messagesSelector);
	const router = useRouter();

	useEffect(() => {
		const getStore = async (): Promise<void> => {
			try {
				const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store/${id}`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json"
					}
				});

				const response = await result.json();
				const data = response.data;
				setName(data.name);
				setAddress(data.address);
				setDescription(data.description);
				setIsLoading(false);
			} catch (e) {
				setMessages({
					status: "error",
					message: "接続エラーが発生しました。"
				});
			}
		};

		void getStore();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const clickButton = async (): Promise<void> => {
		setIsSendLoading(true);
		try {
			const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store/${id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					name,
					address,
					description
				})
			});

			if (result.status !== 200) {
				throw new Error();
			}

			const response = await result.json();
			response.messages.forEach((message: Message) => {
				setMessages(message);
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
					value={name}
					onChange={(e) => {
						setName(e.target.value);
					}}
					readonly={isLoading || isSendLoading}
				/>
			</div>
			<div>
				<Label>住所</Label>
				<TextInput
					value={address}
					onChange={(e) => {
						setAddress(e.target.value);
					}}
					readonly={isLoading || isSendLoading}
				/>
			</div>
			<div>
				<Label>詳細</Label>
				<textarea
					value={description}
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
					readOnly={isLoading || isSendLoading}
				/>
			</div>
			<div>
				<Button
					onClick={() => {
						if (!(isLoading || isSendLoading)) {
							void clickButton();
						}
					}}
					loading={isLoading || isSendLoading}
				>
					{isLoading ? "読込中…" : isSendLoading ? "更新中…" : "更新する"}
				</Button>
			</div>
		</form>
	);
}
