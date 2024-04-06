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
import { useAddMenu } from "@/hooks/useAddMenu";
import AllergenSelectModal from "@/components/molecules/AllergenSelectModal";
import ModalBackground from "@/components/atoms/ModalBackground";
import useClickElemenetSet from "@/hooks/useClickElemenetSet";
import AllergenItem from "@/components/atoms/AllergenItem";
import { isEmptyString } from "@/libs/check-string";
import useGetAllergens from "@/hooks/useGetAllergens";

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
	const modalElement = useClickElemenetSet<HTMLDivElement>(() => {
		if (!isAllergenSelectModalOpen) {
			setIsOpen(false);
		}
	}, [isOpen, isAllergenSelectModalOpen]);

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
										disabled={loading}
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
										disabled={loading}
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
									/>
								</div>
								<div
									className={css`
										position: relative;
									`}
								>
									{!loading && (
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
												void addMenu(storeId, menuName, menuDescription, selectAllergens);
											}}
											disabled={loading || isEmptyString(menuName)}
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
