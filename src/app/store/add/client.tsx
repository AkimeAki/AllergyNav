/** @jsxImportSource @emotion/react */
"use client";

import Button from "@/components/atoms/Button";
import Label from "@/components/atoms/Label";
import SubTitle from "@/components/atoms/SubTitle";
import TextArea from "@/components/atoms/TextArea";
import TextInput from "@/components/atoms/TextInput";
import Select from "@/components/atoms/Select";
import { messagesSelector } from "@/selector/messages";
import type { Chain, ChainList, Store } from "@/type";
import { css } from "@emotion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSetRecoilState } from "recoil";

export default function (): JSX.Element {
	const [name, setName] = useState<Store["name"]>("");
	const [address, setAddress] = useState<Store["address"]>("");
	const [chain, setChain] = useState<ChainList>({
		id: null,
		name: null
	});
	const [chainList, setChainList] = useState<ChainList[]>([]);
	const [description, setDescription] = useState<Store["description"]>("");
	const [loading, setLoading] = useState<boolean>(false);
	const setMessages = useSetRecoilState(messagesSelector);
	const router = useRouter();

	const clickButton = async (): Promise<void> => {
		if (name === "" || address === "") {
			return;
		}

		try {
			setLoading(true);
			const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					name,
					address,
					description,
					chain: chain.id
				})
			});

			if (result.status !== 200) {
				throw new Error();
			}

			const response = await result.json();
			const id = response.id;
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

	const clickChainSelector = async (): Promise<void> => {
		try {
			const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chain`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json"
				}
			});

			const response = await result.json();
			const chainList: ChainList[] = [];
			response.forEach((chain: Chain) => {
				chainList.push({
					id: chain.id,
					name: chain.name
				});
			});
			setChainList(chainList);
		} catch (e) {
			setLoading(true);
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
			onSubmit={(e) => {
				e.preventDefault();
			}}
		>
			<SubTitle>お店を追加</SubTitle>
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
						disabled={loading}
					/>
				</div>
				<div>
					<Label>住所</Label>
					<TextInput
						onChange={(e) => {
							setAddress(e.target.value);
						}}
						disabled={loading}
					/>
				</div>
				<div>
					<Label>チェーン店</Label>
					<Select
						value={chain.id === null ? "null" : String(chain.id)}
						disabled={loading}
						onChange={(e) => {
							setChain({
								id: isNaN(parseInt(e.target.value)) ? null : parseInt(e.target.value),
								name: null
							});
						}}
						onClick={() => {
							void clickChainSelector();
						}}
					>
						<option value="null">なし</option>
						{chainList.map((chain) => (
							<option key={chain.id} value={String(chain.id)}>
								{chain.name}
							</option>
						))}
					</Select>
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
