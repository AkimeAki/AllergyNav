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
import GoogleIcon from "@/components/atoms/GoogleIcon";
import Cursor from "@/components/atoms/Cursor";
import FloatMessage from "@/components/atoms/FloatMessage";
import { useEditStore } from "@/hooks/useEditStore";
import useClickElemenetSet from "@/hooks/useClickElemenetSet";
import ModalBackground from "@/components/atoms/ModalBackground";
import { isEmptyString } from "@/libs/check-string";
import useGetStore from "@/hooks/useGetStore";
import { useRouter } from "next/navigation";
interface Props {
	storeId: string;
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function ({ storeId, isOpen, setIsOpen }: Props): JSX.Element {
	const [storeName, setStoreName] = useState<string>("");
	const [oldStoreName, setOldStoreName] = useState<string>("");
	const [storeAddress, setStoreAddress] = useState<string>("");
	const [oldStoreAddress, setOldStoreAddress] = useState<string>("");
	const [storeDescription, setStoreDescription] = useState<string>("");
	const [oldStoreDescription, setOldStoreDescription] = useState<string>("");
	const { response: editStoreResponse, loading: editStoreLoading, message, editStore } = useEditStore();
	const { response: getStoreResponse, loading: getStoreLoading, getStore } = useGetStore();
	const [isChanged, setIsChanged] = useState<boolean>(false);
	const router = useRouter();
	const modalElement = useClickElemenetSet<HTMLDivElement>(() => {
		if (!editStoreLoading && !getStoreLoading) {
			setIsOpen(false);
		}
	}, [isOpen, editStoreLoading, getStoreLoading]);

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
		if (editStoreResponse !== undefined) {
			router.refresh();
			setIsOpen(false);
		}
	}, [editStoreResponse]);

	return (
		<>
			{editStoreLoading && (
				<>
					<Cursor cursor="wait" />
					<FloatMessage type="success">入力データを送信しています</FloatMessage>
				</>
			)}
			{message !== undefined && message.type === "error" && (
				<FloatMessage type="error">{message.text}</FloatMessage>
			)}
			{isOpen && (
				<>
					<ModalBackground />
					<div
						className={css`
							position: fixed;
							top: 50%;
							left: 50%;
							transform: translate(-50%, -50%);
							width: 100%;
							max-width: 800px;
							padding: 30px;
							z-index: 99999;
							user-select: none;
							pointer-events: none;
						`}
					>
						<div
							className={css`
								background-color: white;
								border-radius: 20px;
								padding: 20px;
								box-shadow: 0 0 20px -5px #969696;
								max-height: calc(100vh - 60px);
								overflow-y: auto;
								user-select: text;
								pointer-events: auto;
							`}
							ref={modalElement}
						>
							<SubTitle>お店の情報を編集</SubTitle>
							<form
								className={css`
									display: flex;
									flex-direction: column;
									gap: 20px;
									margin-top: 30px;
									padding: 0 10px;

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
								<div
									className={css`
										position: relative;
									`}
								>
									{!editStoreLoading && !getStoreLoading && (
										<div
											className={css`
												position: absolute;
												bottom: 0;
												left: 0;
												font-size: 0;
												cursor: pointer;
												user-select: none;
											`}
											onClick={() => {
												setIsOpen(false);
											}}
										>
											<GoogleIcon size={30} name="close" color="var(--color-black)" />
										</div>
									)}

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
						</div>
					</div>
				</>
			)}
		</>
	);
}
