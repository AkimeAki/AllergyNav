"use client";
import { css } from "@kuma-ui/core";
import SubTitle from "@/components/atoms/SubTitle";
import Label from "@/components/atoms/Label";
import Select from "@/components/atoms/Select";
import TextArea from "@/components/atoms/TextArea";
import Button from "@/components/atoms/Button";
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";
import Cursor from "@/components/atoms/Cursor";
import { useAddPicture } from "@/hooks/useAddPicture";
import Modal from "@/components/molecules/Modal";
import { useFloatMessage } from "@/hooks/useFloatMessage";
import FileUpload from "@/components/atoms/FileUpload";

interface Props {
	storeId: string;
	menuId?: string;
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	callback?: () => void;
}

export default function ({ storeId, menuId, isOpen, setIsOpen, callback }: Props): JSX.Element {
	const [pictureData, setPictureData] = useState<File | undefined>(undefined);
	const [pictureDescription, setPictureDescription] = useState<string>("");
	const {
		response: addedPicture,
		loading: addPictureLoading,
		message: addedPictureMessage,
		addPicture
	} = useAddPicture();
	const { addMessage } = useFloatMessage();

	useEffect(() => {
		if (addedPicture !== undefined) {
			setPictureData(undefined);
			setPictureDescription("");
			if (callback !== undefined) {
				callback();
			}
		}
	}, [addedPicture]);

	useEffect(() => {
		if (addPictureLoading) {
			addMessage("入力データを送信しています", "success");
		}
	}, [addPictureLoading]);

	useEffect(() => {
		if (addedPictureMessage !== undefined && addedPictureMessage.type === "error") {
			addMessage(addedPictureMessage.text, "error");
		}
	}, [addedPictureMessage]);

	useEffect(() => {
		console.log(pictureData);
	}, [pictureData]);

	return (
		<>
			{addPictureLoading && <Cursor cursor="wait" />}
			{isOpen && (
				<Modal isOpen={isOpen} setIsOpen={setIsOpen} close={!addPictureLoading}>
					<SubTitle>写真を追加</SubTitle>
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
							<Label>写真をアップロード</Label>
							<FileUpload
								disabled={addPictureLoading}
								onChange={(e) => {
									const files = e.target.files;
									console.log(files);
									if (files !== null && files.length === 1) {
										setPictureData(files[0]);
									}
								}}
								accept=".png"
							/>
						</div>
						<div>
							<Label>メニューと紐づける（未実装）</Label>
							<Select value="null" disabled={true}>
								<option value="null">なし</option>
							</Select>
						</div>
						<div>
							<Label>写真の情報</Label>
							<TextArea
								disabled={addPictureLoading}
								onChange={(e) => {
									setPictureDescription(e.target.value);
								}}
								autoSize
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
										if (pictureData !== undefined) {
											void addPicture(storeId, pictureData, pictureDescription, menuId);
										}
									}}
									disabled={addPictureLoading || pictureData === undefined}
								>
									登録する
								</Button>
							</div>
						</div>
					</form>
				</Modal>
			)}
		</>
	);
}
