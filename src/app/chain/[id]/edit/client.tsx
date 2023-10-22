/** @jsxImportSource @emotion/react */
"use client";

import Button from "@/components/atoms/Button";
import Label from "@/components/atoms/Label";
import TextArea from "@/components/atoms/TextArea";
import TextInput from "@/components/atoms/TextInput";
import { messagesSelector } from "@/selector/messages";
import type { Chain } from "@/type";
import { css } from "@emotion/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";

interface Props {
	id: number;
}

export default function Client({ id }: Props): JSX.Element {
	const [name, setName] = useState<Chain["name"]>("");
	const [description, setDescription] = useState<Chain["description"]>("");
	const [loading, setLoading] = useState(true);
	const [isSendLoading, setIsSendLoading] = useState(false);
	const setMessages = useSetRecoilState(messagesSelector);
	const router = useRouter();

	useEffect(() => {
		const getStore = async (): Promise<void> => {
			try {
				const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chain/${id}`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json"
					}
				});

				const response = await result.json();
				setName(response.name);
				setDescription(response.description);
				setLoading(false);
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
			const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chain/${id}`, {
				method: "PUT",
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

			setMessages({
				status: "success",
				message: "チェーン店を編集できました。"
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
		<form
			css={css`
				display: flex;
				flex-direction: column;
				gap: 20px;
			`}
			onSubmit={(e) => {
				e.preventDefault();
			}}
		>
			<div>
				<Label>名前</Label>
				<TextInput
					value={name}
					onChange={(e) => {
						setName(e.target.value);
					}}
					disabled={loading || isSendLoading}
				/>
			</div>
			<div>
				<Label>詳細</Label>
				<TextArea value={description} setValue={setDescription} disabled={loading || isSendLoading} />
			</div>
			<div>
				<Button
					onClick={() => {
						if (!(loading || isSendLoading)) {
							void clickButton();
						}
					}}
					loading={loading || isSendLoading}
				>
					{loading ? "読込中…" : isSendLoading ? "更新中…" : "更新する"}
				</Button>
			</div>
		</form>
	);
}
