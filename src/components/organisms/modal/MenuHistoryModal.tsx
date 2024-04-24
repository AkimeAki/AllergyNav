"use client";
import { css } from "@kuma-ui/core";
import SubTitle from "@/components/atoms/SubTitle";
import type { Dispatch, SetStateAction } from "react";
import { useEffect } from "react";
import useGetMenuHistories from "@/hooks/fetch-api/useGetMenuHistories";
import Label from "@/components/atoms/Label";
import AllergenItem from "@/components/atoms/AllergenItem";
import Modal from "@/components/molecules/Modal";
import { useFloatMessage } from "@/hooks/useFloatMessage";
import LoadingCircleCenter from "@/components/atoms/LoadingCircleCenter";

interface Props {
	menuId: string;
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function ({ menuId, isOpen, setIsOpen }: Props): JSX.Element {
	const { getMenuHistoriesResponse, getMenuHistoriesStatus, getMenuHistories } = useGetMenuHistories();
	const { addMessage } = useFloatMessage();

	useEffect(() => {
		if (isOpen) {
			getMenuHistories(menuId);
		}
	}, [isOpen]);

	useEffect(() => {
		if (getMenuHistoriesStatus === "failed") {
			addMessage("履歴の取得に失敗しました", "error");
		}
	}, [getMenuHistoriesStatus]);

	return (
		<Modal isOpen={isOpen} setIsOpen={setIsOpen}>
			<SubTitle>メニューの変更履歴</SubTitle>
			<div
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
				{(getMenuHistoriesStatus === "loading" || getMenuHistoriesStatus === "yet") && <LoadingCircleCenter />}
				<div>
					{[...(getMenuHistoriesResponse ?? [])].reverse().map((menu) => {
						return (
							<div
								key={menu.id}
								className={css`
									transition-duration: 200ms;
									transition-property: box-shadow;
									overflow: hidden;
									border-radius: 7px;
									border-width: 2px;
									border-style: solid;
									border-color: #f3f3f3;
									padding: 10px;
									width: 100%;
									display: flex;
									flex-direction: column;
									gap: 20px;
								`}
							>
								<h3
									className={css`
										width: 100%;
										font-size: 20px;
									`}
								>
									{menu.name}
								</h3>
								{menu.allergens.length !== 0 && (
									<div
										className={css`
											display: flex;
											flex-direction: column;
											gap: 5px;
										`}
									>
										<Label>含まれるアレルゲン</Label>
										<div
											className={css`
												display: flex;
												flex-wrap: wrap;
											`}
										>
											{menu.allergens.map((item) => {
												return (
													<AllergenItem
														key={item.id}
														image={`/icons/${item.id}.png`}
														text={item.name}
													/>
												);
											})}
										</div>
									</div>
								)}
							</div>
						);
					})}
				</div>
			</div>
		</Modal>
	);
}
