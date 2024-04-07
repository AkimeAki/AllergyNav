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
import FloatMessage from "@/components/atoms/FloatMessage";
import { useAddMenu } from "@/hooks/useAddMenu";
import AllergenSelectModal from "@/components/molecules/AllergenSelectModal";
import AllergenItem from "@/components/atoms/AllergenItem";
import { isEmptyString } from "@/libs/check-string";
import useGetAllergens from "@/hooks/useGetAllergens";
import Modal from "@/components/molecules/Modal";

interface Props {
	storeId: string;
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	reload: () => void;
}

export default function ({ storeId, isOpen, setIsOpen, reload }: Props): JSX.Element {
	const [menuName, setMenuName] = useState<string>("");
	const [menuDescription, setMenuDescription] = useState<string>("");
	const { response: menu, loading, message, addMenu } = useAddMenu();
	const [selectAllergens, setSelectAllergens] = useState<string[]>([]);
	const [isAllergenSelectModalOpen, setIsAllergenSelectModalOpen] = useState<boolean>(false);
	const { response: allergens, getAllergens } = useGetAllergens();

	useEffect(() => {
		void getAllergens();
	}, []);

	useEffect(() => {
		if (menu !== undefined) {
			setIsOpen(false);
			setMenuDescription("");
			setMenuName("");
			setSelectAllergens([]);
			reload();
		}
	}, [menu]);

	return (
		<>
			{loading && (
				<>
					<Cursor cursor="wait" />
					<FloatMessage type="success">入力データを送信しています</FloatMessage>
				</>
			)}
			{message !== undefined && message.type === "error" && (
				<FloatMessage type="error">{message.text}</FloatMessage>
			)}
			{isOpen && (
				<Modal isOpen={isOpen} setIsOpen={setIsOpen} close={!loading && menu === undefined}>
					<SubTitle>メニューを追加</SubTitle>
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
							<Label required>名前</Label>
							<TextInput
								disabled={loading || menu !== undefined}
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
								disabled={loading || menu !== undefined}
							/>
							<div
								className={css`
									display: flex;
									flex-wrap: wrap;
								`}
							>
								{selectAllergens.map((item) => {
									let name = "";
									allergens.forEach((allergen) => {
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
								disabled={loading}
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
										void addMenu(storeId, menuName, menuDescription, selectAllergens);
									}}
									disabled={loading || menu !== undefined || isEmptyString(menuName)}
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
