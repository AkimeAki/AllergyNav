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
import Modal from "@/components/molecules/Modal";
import { useFloatMessage } from "@/hooks/useFloatMessage";
import useGetMenus from "@/hooks/fetch-api/useGetMenus";
import useEditPicture from "@/hooks/fetch-api/useEditPicture";
import useGetPicture from "@/hooks/fetch-api/useGetPicture";

interface Props {
	pictureId: string;
	storeId: string;
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	callback?: () => void;
}

export default function ({ pictureId, storeId, isOpen, setIsOpen, callback }: Props): JSX.Element {
	const [pictureDescription, setPictureDescription] = useState<string>("");
	const [oldPictureDescription, setOldPictureDescription] = useState<string>("");
	const { addMessage } = useFloatMessage();
	const [isChanged, setIsChanged] = useState<boolean>(false);
	const { getMenus, getMenusResponse, getMenusStatus } = useGetMenus();
	const { getPicture, getPictureResponse, getPictureStatus } = useGetPicture();
	const { editPicture, editPictureStatus, editPictureReset } = useEditPicture();
	const [pictureMenuId, setPictureMenuId] = useState<string>("null");
	const [oldPictureMenuId, setOldPictureMenuId] = useState<string>("null");

	useEffect(() => {
		if (editPictureStatus === "successed") {
			setPictureDescription("");
			if (callback !== undefined) {
				callback();
			}
		}

		if (editPictureStatus === "loading") {
			addMessage("入力データを送信しています", "success");
		}

		if (editPictureStatus === "failed") {
			addMessage("画像の編集に失敗しました", "error");
		}
	}, [editPictureStatus]);

	useEffect(() => {
		if (getPictureStatus === "successed") {
			if (pictureDescription !== oldPictureDescription || pictureMenuId !== oldPictureMenuId) {
				setIsChanged(true);
			} else {
				setIsChanged(false);
			}
		}
	}, [pictureDescription, getPictureStatus, pictureMenuId]);

	useEffect(() => {
		if (getPictureStatus === "successed" && getPictureResponse !== undefined) {
			setPictureDescription(getPictureResponse.description);
			setOldPictureDescription(getPictureResponse.description);
			setPictureMenuId(getPictureResponse.menu_id ?? "null");
			setOldPictureMenuId(getPictureResponse.menu_id ?? "null");
		}
	}, [getPictureStatus]);

	useEffect(() => {
		if (!isOpen) {
			setPictureDescription("");
			editPictureReset();
		} else {
			getMenus("", "", storeId);
			getPicture(pictureId);
		}
	}, [isOpen]);

	return (
		<>
			{getPictureStatus === "loading" && <Cursor cursor="wait" />}
			<Modal
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				close={editPictureStatus !== "loading" && editPictureStatus !== "successed"}
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
				<SubTitle>写真を編集</SubTitle>
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
						<Label>メニューと紐づける</Label>
						<Select
							value={pictureMenuId}
							disabled={
								getMenusStatus === "loading" ||
								editPictureStatus === "loading" ||
								getPictureStatus === "loading"
							}
							loading={getMenusStatus === "loading" || getPictureStatus === "loading"}
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
							disabled={editPictureStatus === "loading" || getPictureStatus === "loading"}
							loading={getPictureStatus === "loading"}
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
									editPicture(pictureId, pictureDescription, pictureMenuId);
								}}
								disabled={
									editPictureStatus === "loading" || getPictureStatus === "loading" || !isChanged
								}
								loading={editPictureStatus === "loading" || getPictureStatus === "loading"}
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
