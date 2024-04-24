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
import useAddMenu from "@/hooks/fetch-api/useAddMenu";
import AllergenSelectModal from "@/components/molecules/AllergenSelectModal";
import AllergenItem from "@/components/atoms/AllergenItem";
import { isEmptyString } from "@/libs/check-string";
import useGetAllergens from "@/hooks/fetch-api/useGetAllergens";
import Modal from "@/components/molecules/Modal";
import { useFloatMessage } from "@/hooks/useFloatMessage";

interface Props {
	storeId: string;
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	callback?: () => void;
}

export default function ({ storeId, isOpen, setIsOpen, callback }: Props): JSX.Element {
	const [menuName, setMenuName] = useState<string>("");
	const [menuDescription, setMenuDescription] = useState<string>("");
	const { addMenuStatus, addMenu } = useAddMenu();
	const [selectAllergens, setSelectAllergens] = useState<string[]>([]);
	const [isAllergenSelectModalOpen, setIsAllergenSelectModalOpen] = useState<boolean>(false);
	const { getAllergensResponse, getAllergens } = useGetAllergens();
	const { addMessage } = useFloatMessage();

	useEffect(() => {
		getAllergens();
	}, []);

	useEffect(() => {
		if (addMenuStatus === "successed") {
			setMenuDescription("");
			setMenuName("");
			setSelectAllergens([]);
			if (callback !== undefined) {
				callback();
			}
		}

		if (addMenuStatus === "loading") {
			addMessage("入力データを送信しています", "success");
		}

		if (addMenuStatus === "failed") {
			addMessage("送信に失敗しました", "error");
		}
	}, [addMenuStatus]);

	return (
		<>
			{addMenuStatus === "loading" && <Cursor cursor="wait" />}
			<Modal isOpen={isOpen} setIsOpen={setIsOpen} close={addMenuStatus !== "loading"}>
				<SubTitle>メニューを追加</SubTitle>
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
							value={menuName}
							disabled={addMenuStatus === "loading"}
							loading={addMenuStatus === "loading"}
							onChange={(e) => {
								setMenuName(e.target.value);
							}}
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
							disabled={addMenuStatus === "loading"}
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
							value={menuDescription}
							disabled={addMenuStatus === "loading"}
							loading={addMenuStatus === "loading"}
							onChange={(e) => {
								setMenuDescription(e.target.value);
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
									addMenu(storeId, menuName, menuDescription, selectAllergens);
								}}
								disabled={addMenuStatus === "loading" || isEmptyString(menuName)}
								loading={addMenuStatus === "loading" || isEmptyString(menuName)}
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
