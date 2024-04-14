"use client";
import { css } from "@kuma-ui/core";
import SubTitle from "@/components/atoms/SubTitle";
import type { Dispatch, SetStateAction } from "react";
import { useEffect } from "react";
import FloatMessage from "@/components/atoms/FloatMessage";
import useGetMenuHistories from "@/hooks/useGetMenuHistories";
import Label from "@/components/atoms/Label";
import AllergenItem from "@/components/atoms/AllergenItem";
import Loading from "@/components/atoms/Loading";
import Modal from "@/components/molecules/Modal";

interface Props {
	menuId: string;
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function ({ menuId, isOpen, setIsOpen }: Props): JSX.Element {
	const { response: menuHistories, loading, message, getMenuHistories } = useGetMenuHistories();

	useEffect(() => {
		if (isOpen) {
			void getMenuHistories(menuId);
		}
	}, [isOpen]);

	return (
		<>
			{message !== undefined && message.type === "error" && (
				<FloatMessage type="error">{message.text}</FloatMessage>
			)}
			<Modal isOpen={isOpen} setIsOpen={setIsOpen} close={!loading}>
				<SubTitle>メニューの変更履歴</SubTitle>
				<div
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
					{loading && (
						<div>
							<Loading />
						</div>
					)}
					<div>
						{[...menuHistories].reverse().map((menu) => {
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
		</>
	);
}
