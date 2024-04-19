"use client";
import { css } from "@kuma-ui/core";
import SubTitle from "@/components/atoms/SubTitle";
import Label from "@/components/atoms/Label";
import TextInput from "@/components/atoms/TextInput";
import Select from "@/components/atoms/Select";
import TextArea from "@/components/atoms/TextArea";
import Button from "@/components/atoms/Button";
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cursor from "@/components/atoms/Cursor";
import { useAddStore } from "@/hooks/useAddStore";
import { isEmptyString } from "@/libs/check-string";
import Modal from "@/components/molecules/Modal";
import { useFloatMessage } from "@/hooks/useFloatMessage";

interface Props {
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function ({ isOpen, setIsOpen }: Props): JSX.Element {
	const [storeName, setStoreName] = useState<string>("");
	const [storeAddress, setStoreAddress] = useState<string>("");
	const [storeDescription, setStoreDescription] = useState<string>("");
	const router = useRouter();
	const { response: addedStore, loading, message, addStore } = useAddStore();
	const { addMessage } = useFloatMessage();

	useEffect(() => {
		if (addedStore !== undefined) {
			router.push(`/store/${addedStore.id}`);
		}
	}, [addedStore]);

	useEffect(() => {
		if (loading) {
			addMessage("入力データを送信しています", "success", "path");
		}
	}, [loading]);

	useEffect(() => {
		if (message !== undefined && message.type === "error") {
			addMessage(message.text, "error");
		}
	}, [message]);

	return (
		<>
			{(loading || addedStore !== undefined) && <Cursor cursor="wait" />}
			<Modal isOpen={isOpen} setIsOpen={setIsOpen} close={!loading && addedStore === undefined}>
				<SubTitle>お店を追加</SubTitle>
				<form
					className={css`
						display: flex;
						flex-direction: column;
						gap: 20px;
						margin-top: 30px;

						& > div {
							display: flex;
							align-items: flex-start;
							flex-direction: column;
							gap: 10px;
						}
					`}
				>
					<div>
						<Label required>お店の名前</Label>
						<TextInput
							value={storeName}
							disabled={loading || addedStore !== undefined}
							onChange={(e) => {
								setStoreName(e.target.value);
							}}
						/>
					</div>
					<div>
						<Label required>住所</Label>
						<p>郵便番号は除外してください。</p>
						<TextInput
							value={storeAddress}
							disabled={loading || addedStore !== undefined}
							onChange={(e) => {
								setStoreAddress(e.target.value);
							}}
						/>
					</div>
					<div>
						<Label>グループ（未実装）</Label>
						<Select value="null" disabled>
							<option value="null">なし</option>
						</Select>
					</div>
					<div>
						<Label>お店の詳細情報</Label>
						<TextArea
							value={storeDescription}
							disabled={loading || addedStore !== undefined}
							autoSize
							onChange={(e) => {
								setStoreDescription(e.target.value);
							}}
						/>
					</div>
					<div>
						<div
							className={css`
								width: 100%;
								text-align: right;
							`}
						>
							<Button
								onClick={() => {
									void addStore(storeName, storeAddress, storeDescription);
								}}
								disabled={
									loading ||
									addedStore !== undefined ||
									isEmptyString(storeName) ||
									isEmptyString(storeAddress)
								}
							>
								登録する
							</Button>
						</div>
					</div>
				</form>
			</Modal>
		</>
	);
}
