"use client";

import { css } from "@kuma-ui/core";
import SubTitle from "@/components/atoms/SubTitle";
import Label from "@/components/atoms/Label";
import TextArea from "@/components/atoms/TextArea";
import Button from "@/components/atoms/Button";
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";
import Cursor from "@/components/atoms/Cursor";
import useEditMenu from "@/hooks/fetch-api/useEditMenu";
import useGetMenu from "@/hooks/fetch-api/useGetMenu";
import AllergenItem from "@/components/atoms/AllergenItem";
import { isEmptyString } from "@/libs/check-string";
import useGetAllergens from "@/hooks/fetch-api/useGetAllergens";
import Modal from "@/components/molecules/Modal";
import { useFloatMessage } from "@/hooks/useFloatMessage";
import type { AllergenItemStatus, AllergenStatusValue } from "@/type";
import SelectAllergenModal from "@/components/organisms/modal/SelectAllergenModal";
import InputText from "@/components/atoms/InputText";

interface Props {
	menuId: string;
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	callback?: () => void;
}

export default function ({ menuId, isOpen, setIsOpen, callback }: Props): JSX.Element {
	const [menuName, setMenuName] = useState<string>("");
	const [oldMenuName, setOldMenuName] = useState<string>("");
	const [menuDescription, setMenuDescription] = useState<string>("");
	const [oldMenuDescription, setOldMenuDescription] = useState<string>("");
	const { editMenuStatus, editMenu, editMenuReset } = useEditMenu();
	const { getMenuResponse, getMenuStatus, getMenu } = useGetMenu();
	const [isChanged, setIsChanged] = useState<boolean>(false);
	const { getAllergens, getAllergensResponse } = useGetAllergens();
	const { addMessage } = useFloatMessage();
	const [allergenStatus, setAllergenStatus] = useState<Record<string, AllergenStatusValue>>({});
	const [oldAllergenStatus, setOldAllergenStatus] = useState<Record<string, AllergenStatusValue>>({});
	const [isSelectAllergenModalOpen, setIsSelectAllergenModalOpen] = useState<boolean>(false);

	useEffect(() => {
		if (isOpen) {
			getMenu(menuId);
			getAllergens();
		} else {
			editMenuReset();
			setMenuName("");
			setOldMenuName("");
			setMenuDescription("");
			setOldMenuDescription("");
			setAllergenStatus({});
			setOldAllergenStatus({});
		}
	}, [isOpen]);

	useEffect(() => {
		if (getMenuStatus === "successed" && getMenuResponse !== undefined) {
			setAllergenStatus(getMenuResponse.allergens);
		}
	}, [getMenuResponse, getMenuStatus]);

	useEffect(() => {
		if (
			getMenuStatus === "successed" &&
			getMenuResponse !== undefined &&
			Object.keys(allergenStatus).length !== 0
		) {
			setMenuName(getMenuResponse.name);
			setOldMenuName(getMenuResponse.name);
			setMenuDescription(getMenuResponse.description);
			setOldMenuDescription(getMenuResponse.description);
			setOldAllergenStatus(getMenuResponse.allergens);
		}
	}, [getMenuStatus, getMenuResponse, allergenStatus]);

	useEffect(() => {
		if (editMenuStatus === "successed") {
			addMessage("メニューを更新しました！", "success");
			if (callback !== undefined) {
				callback();
			}
		}

		if (editMenuStatus === "loading") {
			addMessage("入力データを送信しています", "success");
		}

		if (editMenuStatus === "failed") {
			addMessage("メニューの編集に失敗しました", "error");
		}
	}, [editMenuStatus]);

	useEffect(() => {
		if (
			getMenuStatus === "successed" &&
			(oldMenuName !== menuName ||
				oldMenuDescription !== menuDescription ||
				JSON.stringify(allergenStatus) !== JSON.stringify(oldAllergenStatus))
		) {
			setIsChanged(true);
		} else {
			setIsChanged(false);
		}
	}, [menuName, menuDescription, allergenStatus, editMenuStatus]);

	return (
		<>
			{editMenuStatus === "loading" && <Cursor cursor="wait" />}
			<Modal
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				close={editMenuStatus !== "loading" && editMenuStatus !== "successed" && !isSelectAllergenModalOpen}
				onOutsideClick={
					isChanged
						? () => {
								const result = confirm("編集中のデータが消えますが、閉じても良いですか？");
								if (result) {
									setIsOpen(false);
								}
							}
						: undefined
				}
			>
				<SubTitle>メニューを編集</SubTitle>
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
						<Label required>名前</Label>
						<InputText
							disabled={editMenuStatus === "loading" || getMenuStatus === "loading"}
							loading={getMenuStatus === "loading"}
							onChange={(e) => {
								setMenuName(e.target.value);
							}}
							value={menuName}
						/>
					</div>
					<div>
						<Label>含まれるアレルゲン</Label>
						<Button
							onClick={() => {
								setIsSelectAllergenModalOpen(true);
							}}
							disabled={editMenuStatus === "loading" || getMenuStatus === "loading"}
							loading={getMenuStatus === "loading"}
						>
							選択する
						</Button>
						<div
							className={css`
								display: flex;
								flex-wrap: wrap;
								column-gap: 6px;
							`}
						>
							{getAllergensResponse?.map((allergen) => {
								let status: AllergenItemStatus = "unkown";
								if (allergenStatus[allergen.id] === "unkown") {
									status = "unkown";
								} else if (allergenStatus[allergen.id] === "contain") {
									status = "contain";
								} else if (allergenStatus[allergen.id] === "not contained") {
									return "";
								} else if (allergenStatus[allergen.id] === "removable") {
									status = "removable";
								}

								return (
									<AllergenItem
										key={allergen.id}
										allergen={allergen.id}
										text={allergen.name}
										status={status}
									/>
								);
							})}
						</div>
					</div>
					<div>
						<Label>メニューの詳細情報</Label>
						<TextArea
							disabled={editMenuStatus === "loading" || getMenuStatus === "loading"}
							loading={getMenuStatus === "loading"}
							onChange={(e) => {
								setMenuDescription(e.target.value);
							}}
							value={menuDescription}
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
									editMenu(menuId, menuName, menuDescription, allergenStatus);
								}}
								disabled={
									editMenuStatus === "loading" ||
									getMenuStatus === "loading" ||
									isEmptyString(menuName) ||
									!isChanged
								}
								loading={editMenuStatus === "loading" || getMenuStatus === "loading"}
							>
								登録する
							</Button>
						</div>
					</div>
				</form>
			</Modal>
			<SelectAllergenModal
				isOpen={isSelectAllergenModalOpen}
				setIsOpen={setIsSelectAllergenModalOpen}
				allergenStatus={allergenStatus}
				setAllergenStatus={setAllergenStatus}
			/>
		</>
	);
}
