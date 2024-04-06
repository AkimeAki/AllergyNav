"use client";
import { css } from "@kuma-ui/core";
import SubTitle from "@/components/atoms/SubTitle";
import type { Dispatch, SetStateAction } from "react";
import { useEffect } from "react";
import GoogleIcon from "@/components/atoms/GoogleIcon";
import FloatMessage from "@/components/atoms/FloatMessage";
import useGetMenuHistories from "@/hooks/useGetMenuHistories";
import ModalBackground from "@/components/atoms/ModalBackground";
import useClickElemenetSet from "@/hooks/useClickElemenetSet";
import Label from "@/components/atoms/Label";
import AllergenItem from "@/components/atoms/AllergenItem";
import Loading from "@/components/atoms/Loading";

interface Props {
	menuId: string;
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function ({ menuId, isOpen, setIsOpen }: Props): JSX.Element {
	const { response: menuHistories, loading, message, getMenuHistories } = useGetMenuHistories();
	const modalElement = useClickElemenetSet<HTMLDivElement>(() => {
		if (!loading) {
			setIsOpen(false);
		}
	}, [isOpen, loading]);

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
								{!loading && (
									<div>
										<div
											className={css`
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
									</div>
								)}
							</div>
						</div>
					</div>
				</>
			)}
		</>
	);
}
