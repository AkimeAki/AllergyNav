/** @jsxImportSource @emotion/react */
"use client";

import Button from "@/components/atoms/Button";
import Label from "@/components/atoms/Label";
import TextArea from "@/components/atoms/TextArea";
import TextInput from "@/components/atoms/TextInput";
import Select from "@/components/atoms/Select";
import { messagesSelector } from "@/selector/messages";
import type { Chain, Store, ChainList } from "@/type";
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
	const [chain, setChain] = useState<ChainList>({
		id: null,
		name: null
	});
	const [openedChain, setOpenedChain] = useState<boolean>(false);
	const [chainList, setChainList] = useState<ChainList[]>([]);
	const [description, setDescription] = useState<Store["description"]>("");
	const [loading, setLoading] = useState(true);
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

				if (result.status !== 200) {
					throw new Error();
				}

				const response = await result.json();
				setName(response.name);
				setAddress(response.address);
				setChain({
					id: response.chain_id,
					name: response.chain_name
				});

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

	const clickChainSelector = async (): Promise<void> => {
		try {
			const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chain`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json"
				}
			});

			if (result.status !== 200) {
				throw new Error();
			}

			const response = await result.json();
			const chainList: ChainList[] = [];
			response.forEach((chain: Chain) => {
				chainList.push({
					id: chain.id,
					name: chain.name
				});
			});
			setOpenedChain(true);
			setChainList(chainList);
		} catch (e) {
			setLoading(true);
			setMessages({
				status: "error",
				message: "接続エラーが発生しました。"
			});
		}
	};

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
					description,
					chain: chain.id
				})
			});

			if (result.status !== 200) {
				throw new Error();
			}

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
				<Label>住所</Label>
				<TextInput
					value={address}
					onChange={(e) => {
						setAddress(e.target.value);
					}}
					disabled={loading || isSendLoading}
				/>
			</div>
			<div>
				<Label>チェーン店</Label>
				<Select
					value={chain.id === null ? "null" : String(chain.id)}
					disabled={loading || isSendLoading}
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
					{!openedChain && (
						<option value={chain.id === null ? "null" : String(chain.id)}>{chain.name ?? "なし"}</option>
					)}
				</Select>
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
