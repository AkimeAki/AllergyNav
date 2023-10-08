/** @jsxImportSource @emotion/react */
"use client";

import Button from "@/components/atoms/Button";
import Label from "@/components/atoms/Label";
import TextInput from "@/components/atoms/TextInput";
import { messagesSelector } from "@/selector/messages";
import { css } from "@emotion/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";

interface Props {
	id: number;
}

export default function Client({ id }: Props): JSX.Element {
	const [name, setName] = useState<string>("");
	const [address, setAddress] = useState<string>("");
	const [, setIsLoading] = useState(true);
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
		try {
			const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store/${id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					name,
					address
				})
			});

			const response = await result.json();
			setMessages(response.messages);
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
				/>
			</div>
			<div>
				<Label>住所</Label>
				<TextInput
					value={address}
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
					更新する
				</Button>
			</div>
		</form>
	);
}
