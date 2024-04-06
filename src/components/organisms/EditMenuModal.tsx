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
import useEditMenu from "@/hooks/useEditMenu";
import useGetMenu from "@/hooks/useGetMenu";
import AllergenSelectModal from "@/components/molecules/AllergenSelectModal";
import ModalBackground from "@/components/atoms/ModalBackground";
import useClickElemenetSet from "@/hooks/useClickElemenetSet";
import AllergenItem from "@/components/atoms/AllergenItem";
import { isEmptyString } from "@/libs/check-string";
import useGetAllergens from "@/hooks/useGetAllergens";

interface Props {
	menuId: string;
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	reload: () => void;
}

export default function ({ menuId, isOpen, setIsOpen, reload }: Props): JSX.Element {
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
	const modalElement = useClickElemenetSet<HTMLDivElement>(() => {
		if (!isAllergenSelectModalOpen) {
			setIsOpen(false);
		}
	}, [isOpen, isAllergenSelectModalOpen, getLoading]);

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
		if (editedMenu !== undefined) {
			setIsOpen(false);
			reload();
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

	return (
		<>
			{editLoading && (
				<>
					<Cursor cursor="wait" />
					<FloatMessage type="success">入力データを送信しています</FloatMessage>
				</>
			)}
			{getMessage !== undefined && getMessage.type === "error" && (
				<FloatMessage type="error">{getMessage.text}</FloatMessage>
			)}
			{editMessage !== undefined && editMessage.type === "error" && (
				<FloatMessage type="error">{editMessage.text}</FloatMessage>
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
							<SubTitle>メニューを編集</SubTitle>
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
										disabled={getLoading || editLoading}
										onChange={(e) => {
											setMenuDescription(e.target.value);
										}}
										value={menuDescription}
									/>
								</div>
								<div
									className={css`
										position: relative;
									`}
								>
									{!getLoading && !editLoading && (
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
												void editMenu(menuId, menuName, menuDescription, selectAllergens);
											}}
											disabled={
												getLoading || editLoading || isEmptyString(menuName) || !isChanged
											}
										>
											登録する
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
