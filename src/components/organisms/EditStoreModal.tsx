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
import Cursor from "@/components/atoms/Cursor";
import { useEditStore } from "@/hooks/useEditStore";
import { isEmptyString } from "@/libs/check-string";
import useGetStore from "@/hooks/useGetStore";
import Modal from "../molecules/Modal";
import { useFloatMessage } from "@/hooks/useFloatMessage";
interface Props {
	storeId: string;
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	callback?: () => void;
}

export default function ({ storeId, isOpen, setIsOpen, callback }: Props): JSX.Element {
	const [storeName, setStoreName] = useState<string>("");
	const [oldStoreName, setOldStoreName] = useState<string>("");
	const [storeAddress, setStoreAddress] = useState<string>("");
	const [oldStoreAddress, setOldStoreAddress] = useState<string>("");
	const [storeDescription, setStoreDescription] = useState<string>("");
	const [oldStoreDescription, setOldStoreDescription] = useState<string>("");
	const { response: editStoreResponse, loading: editStoreLoading, message, editStore } = useEditStore();
	const { response: getStoreResponse, loading: getStoreLoading, getStore } = useGetStore();
	const [isChanged, setIsChanged] = useState<boolean>(false);
	const { addMessage } = useFloatMessage();

	useEffect(() => {
		if (isOpen) {
			void getStore(storeId);
		}
	}, [isOpen]);

	useEffect(() => {
		if (getStoreResponse !== undefined) {
			setStoreName(getStoreResponse.name);
			setOldStoreName(getStoreResponse.name);
			setStoreAddress(getStoreResponse.address);
			setOldStoreAddress(getStoreResponse.address);
			setStoreDescription(getStoreResponse.description);
			setOldStoreDescription(getStoreResponse.description);
		}
	}, [getStoreResponse]);

	useEffect(() => {
		if (
			oldStoreName !== storeName ||
			oldStoreDescription !== storeDescription ||
			oldStoreAddress !== storeAddress
		) {
			setIsChanged(true);
		} else {
			setIsChanged(false);
		}
	}, [storeName, storeDescription, storeAddress]);

	useEffect(() => {
		if (editStoreResponse !== undefined && callback !== undefined) {
			callback();
		}
	}, [editStoreResponse]);

	useEffect(() => {
		if (editStoreLoading) {
			addMessage("入力データを送信しています", "success");
		}
	}, [editStoreLoading]);

	useEffect(() => {
		if (message !== undefined && message.type === "error") {
			addMessage(message.text, "error");
		}
	}, [message]);

	return (
		<>
			{editStoreLoading && <Cursor cursor="wait" />}
			<Modal isOpen={isOpen} setIsOpen={setIsOpen} close={!editStoreLoading}>
				<SubTitle>お店の情報を編集</SubTitle>
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
							disabled={editStoreLoading || getStoreLoading}
							onChange={(e) => {
								setStoreName(e.target.value);
							}}
							value={storeName}
						/>
					</div>
					<div>
						<Label required>住所</Label>
						<p>郵便番号は除外してください。</p>
						<TextInput
							disabled={editStoreLoading || getStoreLoading}
							onChange={(e) => {
								setStoreAddress(e.target.value);
							}}
							value={storeAddress}
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
							autoSize
							disabled={editStoreLoading || getStoreLoading}
							onChange={(e) => {
								setStoreDescription(e.target.value);
							}}
							value={storeDescription}
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
									void editStore(storeId, storeName, storeAddress, storeDescription);
								}}
								disabled={
									editStoreLoading ||
									getStoreLoading ||
									isEmptyString(storeName) ||
									isEmptyString(storeAddress) ||
									!isChanged
								}
							>
								変更する
							</Button>
						</div>
					</div>
				</form>
			</Modal>
		</>
	);
}
