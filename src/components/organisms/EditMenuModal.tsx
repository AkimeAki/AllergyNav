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
import useEditMenu from "@/hooks/useEditMenu";
import useGetMenu from "@/hooks/useGetMenu";
import AllergenSelectModal from "@/components/molecules/AllergenSelectModal";
import AllergenItem from "@/components/atoms/AllergenItem";
import { isEmptyString } from "@/libs/check-string";
import useGetAllergens from "@/hooks/useGetAllergens";
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
	const { response: editedMenu, loading: editLoading, message: editMessage, editMenu } = useEditMenu();
	const { response: menu, loading: getLoading, message: getMessage, getMenu } = useGetMenu();
	const [selectAllergens, setSelectAllergens] = useState<string[]>([]);
	const [oldSelectAllergens, setOldSelectAllergens] = useState<string[]>([]);
	const [isChanged, setIsChanged] = useState<boolean>(false);
	const [isAllergenSelectModalOpen, setIsAllergenSelectModalOpen] = useState<boolean>(false);
	const { response: allergens, getAllergens } = useGetAllergens();
	const { addMessage } = useFloatMessage();

	useEffect(() => {
		if (isOpen) {
			void getMenu(menuId);
		}
	}, [isOpen]);

	useEffect(() => {
		void getAllergens();
	}, []);

	useEffect(() => {
		if (menu !== undefined) {
			setMenuName(menu.name);
			setOldMenuName(menu.name);
			setMenuDescription(menu.description);
			setOldMenuDescription(menu.description);
			setSelectAllergens(menu.allergens.map((allergen) => allergen.id));
			setOldSelectAllergens(menu.allergens.map((allergen) => allergen.id));
		}
	}, [menu]);

	useEffect(() => {
		if (editedMenu !== undefined && callback !== undefined) {
			callback();
		}
	}, [editedMenu]);

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

	useEffect(() => {
		if (editLoading) {
			addMessage("入力データを送信しています", "success");
		}
	}, [editLoading]);

	useEffect(() => {
		if (getMessage !== undefined && getMessage.type === "error") {
			addMessage(getMessage.text, "error");
		}
	}, [getMessage]);

	useEffect(() => {
		if (editMessage !== undefined && editMessage.type === "error") {
			addMessage(editMessage.text, "error");
		}
	}, [editMessage]);

	return (
		<>
			{editLoading && <Cursor cursor="wait" />}
			<Modal isOpen={isOpen} setIsOpen={setIsOpen} close={!editLoading && !isAllergenSelectModalOpen}>
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
							disabled={getLoading || editLoading}
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
							disabled={getLoading || editLoading}
						/>
						<div
							className={css`
								display: flex;
								flex-wrap: wrap;
							`}
						>
							{selectAllergens.map((item) => {
								let name = "";
								allergens?.forEach((allergen) => {
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
							disabled={getLoading || editLoading}
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
									void editMenu(menuId, menuName, menuDescription, selectAllergens);
								}}
								disabled={getLoading || editLoading || isEmptyString(menuName) || !isChanged}
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
