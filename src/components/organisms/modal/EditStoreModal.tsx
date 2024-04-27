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
import useEditStore from "@/hooks/fetch-api/useEditStore";
import { isEmptyString } from "@/libs/check-string";
import useGetStore from "@/hooks/fetch-api/useGetStore";
import Modal from "../../molecules/Modal";
import { useFloatMessage } from "@/hooks/useFloatMessage";
import { includePostCode } from "@/libs/check-address";
import { normalize } from "@geolonia/normalize-japanese-addresses";
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
	const { editStoreStatus, editStore } = useEditStore();
	const { getStoreResponse, getStoreStatus, getStore } = useGetStore();
	const [isChanged, setIsChanged] = useState<boolean>(false);
	const { addMessage } = useFloatMessage();

	const editStoreClick = async (): Promise<void> => {
		if (includePostCode(storeAddress)) {
			addMessage("郵便番号は除外してください", "error");
			return;
		}

		const normalizeResult = await normalize(storeAddress);
		switch (normalizeResult.level) {
			case 0:
				addMessage("都道府県の識別ができません\n\nシステムに問題がある場合はお問い合わせください", "error");
				return;

			case 1:
				addMessage("市区町村の識別ができません\n\nシステムに問題がある場合はお問い合わせください", "error");
				return;

			case 2:
				addMessage("町丁目の識別ができません\n\nシステムに問題がある場合はお問い合わせください", "error");
				return;
		}

		const normalizedAddress =
			normalizeResult.pref + normalizeResult.city + normalizeResult.town + normalizeResult.addr;

		editStore(storeId, storeName, normalizedAddress, storeDescription);
	};

	useEffect(() => {
		if (isOpen) {
			getStore(storeId);
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
		if (editStoreStatus === "successed") {
			addMessage("お店を更新しました！", "success");

			if (callback !== undefined) {
				callback();
			}
		}

		if (editStoreStatus === "loading") {
			addMessage("入力データを送信しています", "success");
		}

		if (editStoreStatus === "failed") {
			addMessage("お店の編集に失敗しました", "error");
		}
	}, [editStoreStatus]);

	return (
		<>
			{editStoreStatus === "loading" && <Cursor cursor="wait" />}
			<Modal isOpen={isOpen} setIsOpen={setIsOpen} close={editStoreStatus !== "loading"}>
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
							disabled={editStoreStatus === "loading" || getStoreStatus === "loading"}
							loading={editStoreStatus === "loading" || getStoreStatus === "loading"}
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
							disabled={editStoreStatus === "loading" || getStoreStatus === "loading"}
							loading={editStoreStatus === "loading" || getStoreStatus === "loading"}
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
							disabled={editStoreStatus === "loading" || getStoreStatus === "loading"}
							loading={editStoreStatus === "loading" || getStoreStatus === "loading"}
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
									void editStoreClick();
								}}
								disabled={
									editStoreStatus === "loading" ||
									getStoreStatus === "loading" ||
									isEmptyString(storeName) ||
									isEmptyString(storeAddress) ||
									!isChanged
								}
								loading={editStoreStatus === "loading" || getStoreStatus === "loading"}
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