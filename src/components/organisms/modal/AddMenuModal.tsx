"use client";
import { css } from "@kuma-ui/core";
import SubTitle from "@/components/atoms/SubTitle";
import Label from "@/components/atoms/Label";
import TextArea from "@/components/atoms/TextArea";
import Button from "@/components/atoms/Button";
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";
import Cursor from "@/components/atoms/Cursor";
import useAddMenu from "@/hooks/fetch-api/useAddMenu";
import AllergenItem from "@/components/atoms/AllergenItem";
import { isEmptyString } from "@/libs/check-string";
import useGetAllergens from "@/hooks/fetch-api/useGetAllergens";
import Modal from "@/components/molecules/Modal";
import { useFloatMessage } from "@/hooks/useFloatMessage";
import SelectAllergenModal from "@/components/organisms/modal/SelectAllergenModal";
import type { AllergenItemStatus, AllergenStatusValue } from "@/type";
import InputText from "@/components/atoms/InputText";

interface Props {
	storeId: string;
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	callback?: () => void;
}

export default function ({ storeId, isOpen, setIsOpen, callback }: Props): JSX.Element {
	const [menuName, setMenuName] = useState<string>("");
	const [menuDescription, setMenuDescription] = useState<string>("");
	const { addMenuStatus, addMenu, addMenuReset } = useAddMenu();
	const [allergenStatus, setAllergenStatus] = useState<Record<string, AllergenStatusValue>>({});
	const { getAllergensResponse, getAllergens, getAllergensStatus } = useGetAllergens();
	const { addMessage } = useFloatMessage();
	const [isSelectAllergenModalOpen, setIsSelectAllergenModalOpen] = useState<boolean>(false);
	const [isChanged, setIsChanged] = useState<boolean>(false);

	useEffect(() => {
		if (getAllergensStatus === "successed" && getAllergensResponse !== undefined) {
			const initAllergenStatus: Record<string, AllergenStatusValue> = {};
			getAllergensResponse.forEach((allergen) => {
				initAllergenStatus[allergen.id] = "unkown";
			});

			setAllergenStatus(initAllergenStatus);
		}
	}, [getAllergensStatus, getAllergensResponse]);

	useEffect(() => {
		if (addMenuStatus === "successed") {
			setMenuDescription("");
			setMenuName("");
			setAllergenStatus({});
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

	useEffect(() => {
		let allergenChanged = false;

		Object.keys(allergenStatus).forEach((key) => {
			if (allergenStatus[key] !== "unkown") {
				allergenChanged = true;
			}
		});

		if (!isEmptyString(menuName) || !isEmptyString(menuDescription) || allergenChanged) {
			setIsChanged(true);
		} else {
			setIsChanged(false);
		}
	}, [menuName, menuDescription, allergenStatus]);

	useEffect(() => {
		if (!isOpen) {
			setMenuName("");
			setMenuDescription("");
			addMenuReset();
		} else {
			getAllergens();
		}
	}, [isOpen]);

	return (
		<>
			{addMenuStatus === "loading" && <Cursor cursor="wait" />}
			<Modal
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				close={addMenuStatus !== "loading" && addMenuStatus !== "successed"}
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
						<InputText
							value={menuName}
							disabled={addMenuStatus === "loading"}
							onChange={(e) => {
								setMenuName(e.target.value);
							}}
						/>
					</div>
					<div>
						<Label>含まれるアレルゲン</Label>
						<Button
							onClick={() => {
								setIsSelectAllergenModalOpen(true);
							}}
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
							value={menuDescription}
							disabled={addMenuStatus === "loading"}
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
									addMenu(storeId, menuName, menuDescription, allergenStatus);
								}}
								disabled={addMenuStatus === "loading" || !isChanged}
								loading={addMenuStatus === "loading"}
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
