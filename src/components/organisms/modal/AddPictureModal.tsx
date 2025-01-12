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
import useAddPicture from "@/hooks/fetch-api/useAddPicture";
import Modal from "@/components/molecules/Modal";
import { useFloatMessage } from "@/hooks/useFloatMessage";
import FileUpload from "@/components/atoms/FileUpload";
import { isEmptyString } from "@/libs/check-string";
import useGetMenus from "@/hooks/fetch-api/useGetMenus";

interface Props {
	storeId: string;
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	callback?: () => void;
}

export default function ({ storeId, isOpen, setIsOpen, callback }: Props): JSX.Element {
	const [pictureData, setPictureData] = useState<File | undefined>(undefined);
	const [pictureDescription, setPictureDescription] = useState<string>("");
	const { addPictureStatus, addPicture, addPictureReset } = useAddPicture();
	const { addMessage } = useFloatMessage();
	const [isChanged, setIsChanged] = useState<boolean>(false);
	const { getMenus, getMenusResponse, getMenusStatus } = useGetMenus();
	const [pictureMenuId, setPictureMenuId] = useState<string>("null");

	useEffect(() => {
		if (addPictureStatus === "successed") {
			setPictureData(undefined);
			setPictureDescription("");
			if (callback !== undefined) {
				callback();
			}
		}

		if (addPictureStatus === "loading") {
			addMessage("入力データを送信しています", "success");
		}

		if (addPictureStatus === "failed") {
			addMessage("画像の登録に失敗しました", "error");
		}
	}, [addPictureStatus]);

	useEffect(() => {
		if (pictureData !== undefined || !isEmptyString(pictureDescription)) {
			setIsChanged(true);
		} else {
			setIsChanged(false);
		}
	}, [pictureData, pictureDescription]);

	useEffect(() => {
		if (!isOpen) {
			setPictureData(undefined);
			setPictureMenuId("null");
			setPictureDescription("");
			getMenus("", "", storeId);
			addPictureReset();
		}
	}, [isOpen]);

	return (
		<>
			{addPictureStatus === "loading" && <Cursor cursor="wait" />}
			<Modal
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				close={addPictureStatus !== "loading" && addPictureStatus !== "successed"}
				onOutsideClick={
					isChanged
						? () => {
								const result = confirm("入力中のデータが消えますが、閉じても良いですか？");
								if (result) {
									setIsOpen(false);
								}
							}
						: undefined
				}
			>
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
							disabled={addPictureStatus === "loading"}
							onChange={(e) => {
								const files = e.target.files;
								console.log(files);
								if (files !== null && files.length === 1) {
									setPictureData(files[0]);
								}
							}}
							accept=".png, .jpg, .jpeg, .gif, .webp"
						/>
					</div>
					<div>
						<Label>メニューと紐づける</Label>
						<Select
							value={pictureMenuId}
							disabled={getMenusStatus === "loading" || addPictureStatus === "loading"}
							loading={getMenusStatus === "loading"}
							onChange={(e) => {
								let selectId = "null";
								Array.from(e.target).forEach((item) => {
									if ((item as HTMLOptionElement).selected) {
										selectId = (item as HTMLOptionElement).value;
									}
								});

								setPictureMenuId(selectId);
							}}
						>
							<option value="null">なし</option>
							{getMenusStatus === "successed" &&
								getMenusResponse?.map((menu) => (
									<option key={menu.id} value={menu.id}>
										{menu.name}
									</option>
								))}
						</Select>
					</div>
					<div>
						<Label>写真の情報</Label>
						<TextArea
							value={pictureDescription}
							disabled={addPictureStatus === "loading"}
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
										void addPicture(storeId, pictureData, pictureDescription, pictureMenuId);
									}
								}}
								disabled={addPictureStatus === "loading" || pictureData === undefined}
								loading={addPictureStatus === "loading"}
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
