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
import useEditMenu from "@/hooks/fetch-api/useEditMenu";
import useGetMenu from "@/hooks/fetch-api/useGetMenu";
import AllergenSelectModal from "@/components/molecules/AllergenSelectModal";
import AllergenItem from "@/components/atoms/AllergenItem";
import { isEmptyString } from "@/libs/check-string";
import useGetAllergens from "@/hooks/fetch-api/useGetAllergens";
import Modal from "@/components/molecules/Modal";
import { useFloatMessage } from "@/hooks/useFloatMessage";

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
	const { editMenuStatus, editMenu } = useEditMenu();
	const { getMenuResponse, getMenuStatus, getMenu } = useGetMenu();
	const [selectAllergens, setSelectAllergens] = useState<string[]>([]);
	const [oldSelectAllergens, setOldSelectAllergens] = useState<string[]>([]);
	const [isChanged, setIsChanged] = useState<boolean>(false);
	const [isAllergenSelectModalOpen, setIsAllergenSelectModalOpen] = useState<boolean>(false);
	const { getAllergens, getAllergensResponse } = useGetAllergens();
	const { addMessage } = useFloatMessage();

	useEffect(() => {
		if (isOpen) {
			getMenu(menuId);
		}
	}, [isOpen]);

	useEffect(() => {
		getAllergens();
	}, []);

	useEffect(() => {
		if (getMenuStatus === "successed" && getMenuResponse !== undefined) {
			setMenuName(getMenuResponse.name);
			setOldMenuName(getMenuResponse.name);
			setMenuDescription(getMenuResponse.description);
			setOldMenuDescription(getMenuResponse.description);
			setSelectAllergens(getMenuResponse.allergens.map((allergen) => allergen.id));
			setOldSelectAllergens(getMenuResponse.allergens.map((allergen) => allergen.id));
		}
	}, [getMenuStatus, getMenuResponse]);

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
			oldMenuName !== menuName ||
			oldMenuDescription !== menuDescription ||
			JSON.stringify(oldSelectAllergens.sort()) !== JSON.stringify(selectAllergens.sort())
		) {
			setIsChanged(true);
		} else {
			setIsChanged(false);
		}
	}, [menuName, menuDescription, selectAllergens]);

	return (
		<>
			{editMenuStatus === "loading" && <Cursor cursor="wait" />}
			<Modal
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				close={editMenuStatus !== "loading" && !isAllergenSelectModalOpen}
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
						<TextInput
							disabled={editMenuStatus === "loading" || getMenuStatus === "loading"}
							loading={editMenuStatus === "loading" || getMenuStatus === "loading"}
							onChange={(e) => {
								setMenuName(e.target.value);
							}}
							value={menuName}
						/>
					</div>
					<div>
						<Label>グループ（未実装）</Label>
						<Select value="null" disabled={true}>
							<option value="null">なし</option>
						</Select>
					</div>
					<div>
						<Label>含まれるアレルゲン</Label>
						<AllergenSelectModal
							selectAllergens={selectAllergens}
							setSelectAllergens={setSelectAllergens}
							isOpen={isAllergenSelectModalOpen}
							setIsOpen={setIsAllergenSelectModalOpen}
							disabled={editMenuStatus === "loading" || getMenuStatus === "loading"}
						/>
						<div
							className={css`
								display: flex;
								flex-wrap: wrap;
							`}
						>
							{selectAllergens.map((item) => {
								let name = "";
								getAllergensResponse?.forEach((allergen) => {
									if (item === allergen.id) {
										name = allergen.name;
									}
								});

								return <AllergenItem key={item} image={`/icons/${item}.png`} text={name} />;
							})}
						</div>
					</div>
					<div>
						<Label>メニューの詳細情報</Label>
						<TextArea
							disabled={editMenuStatus === "loading" || getMenuStatus === "loading"}
							loading={editMenuStatus === "loading" || getMenuStatus === "loading"}
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
									editMenu(menuId, menuName, menuDescription, selectAllergens);
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
		</>
	);
}
