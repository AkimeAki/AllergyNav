"use client";

import { css } from "@kuma-ui/core";
import SubTitle from "@/components/atoms/SubTitle";
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useRef } from "react";
import useGetAllergens from "@/hooks/fetch-api/useGetAllergens";
import Modal from "@/components/molecules/Modal";
import AllergenSelectArea from "@/components/atoms/AllergenSelectArea";
import AllergenItem from "@/components/atoms/AllergenItem";
import { removeSelect, startSelect } from "@/libs/select";
import { removeCursor, setCursor } from "@/libs/cursor";
import type { AllergenStatusValue } from "@/type";

interface Props {
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	allergenStatus: Record<string, AllergenStatusValue>;
	setAllergenStatus: Dispatch<SetStateAction<Record<string, AllergenStatusValue>>>;
}

export default function ({ isOpen, setIsOpen, allergenStatus, setAllergenStatus }: Props): JSX.Element {
	const { getAllergensResponse, getAllergens, getAllergensStatus } = useGetAllergens();
	const holdItemElement = useRef<HTMLDivElement | null>(null);
	const containAreaElement = useRef<HTMLDivElement | null>(null);
	const notContainedAreaElement = useRef<HTMLDivElement | null>(null);
	const removableAreaElement = useRef<HTMLDivElement | null>(null);
	const parentElement = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (isOpen) {
			getAllergens();

			const changeHoldItem = (): void => {
				if (holdItemElement.current === null) {
					return;
				}

				Array.from(holdItemElement.current.children).forEach((element) => {
					const child = element as HTMLDivElement;
					child.dataset.hold = "false";
					if (child.dataset.allergen === holdItemElement.current?.dataset.allergen) {
						child.dataset.hold = "true";
					}
				});
			};

			const hold = (e: MouseEvent | TouchEvent): void => {
				if (e.target === null) {
					return;
				}

				const element = e.target as HTMLDivElement;
				if (element.dataset.holdAllergen !== "true") {
					return;
				}

				if (holdItemElement.current === null || parentElement.current === null) {
					return;
				}

				setCursor("grabbing");
				holdItemElement.current.dataset.allergen = element.dataset.allergen;
				holdItemElement.current.dataset.hold = "true";
				changeHoldItem();

				const rect = parentElement.current.getBoundingClientRect();

				let clientX = 0;
				let clientY = 0;

				if (e.type === "mousedown") {
					clientX = (e as MouseEvent).clientX;
					clientY = (e as MouseEvent).clientY;
				}

				if (e.type === "touchstart") {
					clientX = (e as TouchEvent).touches[0].clientX;
					clientY = (e as TouchEvent).touches[0].clientY;
				}

				holdItemElement.current.style.top = clientY - rect.top - 55 / 2 + "px";
				holdItemElement.current.style.left = clientX - rect.left - 45 / 2 + "px";
				holdItemElement.current.style.opacity = "1";

				removeSelect();
			};

			const stopHold = (e: MouseEvent | TouchEvent): void => {
				startSelect();

				if (holdItemElement.current === null || parentElement.current === null) {
					return;
				}

				if (holdItemElement.current.dataset.hold !== "true") {
					return;
				}

				const allergen = holdItemElement.current.dataset.allergen ?? "";
				holdItemElement.current.dataset.allergen = "";
				holdItemElement.current.dataset.hold = "false";
				changeHoldItem();
				removeCursor();

				if (
					containAreaElement.current !== null &&
					notContainedAreaElement.current !== null &&
					removableAreaElement.current !== null &&
					allergen !== ""
				) {
					const containRect = containAreaElement.current.getBoundingClientRect();
					const notContainedRect = notContainedAreaElement.current.getBoundingClientRect();
					const removableRect = removableAreaElement.current.getBoundingClientRect();
					let selectStatus: AllergenStatusValue = "unkown";

					let clientX = 0;
					let clientY = 0;

					if (e.type === "mouseup") {
						clientX = (e as MouseEvent).clientX;
						clientY = (e as MouseEvent).clientY;
					}

					if (e.type === "touchend") {
						clientX = Number(holdItemElement.current.dataset.x);
						clientY = Number(holdItemElement.current.dataset.y);
					}

					if (
						containRect.left < clientX &&
						clientX < containRect.left + containAreaElement.current.clientWidth &&
						containRect.top < clientY &&
						clientY < containRect.top + containAreaElement.current.clientWidth
					) {
						selectStatus = "contain";
					}

					if (
						notContainedRect.left < clientX &&
						clientX < notContainedRect.left + containAreaElement.current.clientWidth &&
						notContainedRect.top < clientY &&
						clientY < notContainedRect.top + containAreaElement.current.clientWidth
					) {
						selectStatus = "not contained";
					}

					if (
						removableRect.left < clientX &&
						clientX < removableRect.left + containAreaElement.current.clientWidth &&
						removableRect.top < clientY &&
						clientY < removableRect.top + containAreaElement.current.clientWidth
					) {
						selectStatus = "removable";
					}

					setAllergenStatus((status) => {
						const _status: Record<string, AllergenStatusValue> = JSON.parse(JSON.stringify(status));
						_status[allergen] = selectStatus;

						return _status;
					});
				}
			};

			const move = (e: MouseEvent | TouchEvent): void => {
				if (
					holdItemElement.current !== null &&
					parentElement.current !== null &&
					holdItemElement.current.dataset.hold === "true"
				) {
					const rect = parentElement.current.getBoundingClientRect();

					let clientX = 0;
					let clientY = 0;

					if (e.type === "mousemove") {
						clientX = (e as MouseEvent).clientX;
						clientY = (e as MouseEvent).clientY;
					}

					if (e.type === "touchmove") {
						clientX = (e as TouchEvent).touches[0].clientX;
						clientY = (e as TouchEvent).touches[0].clientY;
					}

					holdItemElement.current.style.top = clientY - rect.top - 55 / 2 + "px";
					holdItemElement.current.style.left = clientX - rect.left - 45 / 2 + "px";
					holdItemElement.current.dataset.x = String(clientX);
					holdItemElement.current.dataset.y = String(clientY);
				}
			};

			window.addEventListener("mousedown", hold, false);
			window.addEventListener("mousemove", move, false);
			window.addEventListener("touchend", stopHold, false);
			window.addEventListener("mouseup", stopHold, false);
			window.addEventListener("touchmove", move, false);
			window.addEventListener("touchstart", hold, false);

			return () => {
				window.removeEventListener("mousedown", hold);
				window.removeEventListener("mousemove", move);
				window.removeEventListener("touchend", stopHold);
				window.removeEventListener("mouseup", stopHold);
				window.removeEventListener("touchmove", move);
				window.removeEventListener("touchstart", hold);
			};
		}
	}, [isOpen]);

	useEffect(() => {
		if (
			getAllergensStatus === "successed" &&
			getAllergensResponse !== undefined &&
			Object.keys(allergenStatus).length === 0
		) {
			const initAllergenStatus: Record<string, AllergenStatusValue> = {};
			getAllergensResponse.forEach((allergen) => {
				initAllergenStatus[allergen.id] = "unkown";
			});

			setAllergenStatus(initAllergenStatus);
		}
	}, [getAllergensStatus, getAllergensResponse, allergenStatus]);

	return (
		<>
			<Modal isOpen={isOpen} setIsOpen={setIsOpen} viewBg={false} margin={30} icon="back">
				<div
					className={css`
						position: relative;
					`}
					ref={parentElement}
				>
					<div
						className={css`
							position: absolute;
							user-select: none;
							pointer-events: none;
							z-index: 9999;
							opacity: 0;
							cursor: grab;

							&[data-hold="true"] {
								opacity: 1;
							}
						`}
						ref={holdItemElement}
						data-allergen=""
						data-hold="false"
					>
						{getAllergensResponse?.map((allergen) => {
							return (
								<div
									key={allergen.id}
									data-allergen={allergen.id}
									data-hold="false"
									className={css`
										&[data-hold="false"] {
											display: none;
										}

										&[data-hold="true"] {
											display: block;
										}
									`}
								>
									<AllergenItem
										key={allergen.id}
										image={`/icons/${allergen.id}.png`}
										text={allergen.name}
									/>
								</div>
							);
						})}
					</div>
					<div
						className={css`
							display: flex;
							flex-direction: column;
							gap: 20px;
						`}
					>
						<SubTitle>アレルゲンを選択</SubTitle>
						<div
							className={css`
								position: relative;
								width: 100%;
								height: 400px;
								display: flex;
								flex-direction: column;
								gap: 30px;
								justify-content: space-between;
							`}
						>
							<div
								className={css`
									display: flex;
									flex-wrap: wrap;
									column-gap: 6px;
								`}
							>
								{getAllergensResponse?.map((allergen) => {
									if (allergenStatus[allergen.id] === "unkown") {
										return (
											<div
												key={allergen.id}
												className={css`
													cursor: grab;

													* {
														user-select: none;
														pointer-events: none;
													}
												`}
												data-hold-allergen
												data-allergen={allergen.id}
											>
												<AllergenItem
													image={`/icons/${allergen.id}.png`}
													text={allergen.name}
												/>
											</div>
										);
									}

									return "";
								})}
							</div>
							<div
								className={css`
									display: grid;
									grid-template-columns: 1fr 1fr 1fr;
									gap: 5px;

									@media (max-width: 650px) {
										grid-template-columns: 1fr 1fr;
									}
								`}
							>
								<AllergenSelectArea color="#fd6e64" title="含まれる">
									<div
										ref={containAreaElement}
										className={css`
											display: flex;
											flex-wrap: wrap;
										`}
									>
										{getAllergensResponse?.map((allergen) => {
											if (allergenStatus[allergen.id] === "contain") {
												return (
													<div
														key={allergen.id}
														className={css`
															cursor: grab;

															* {
																user-select: none;
																pointer-events: none;
															}
														`}
														data-hold-allergen
														data-allergen={allergen.id}
													>
														<AllergenItem
															image={`/icons/${allergen.id}.png`}
															text={allergen.name}
														/>
													</div>
												);
											}

											return "";
										})}
									</div>
								</AllergenSelectArea>
								<AllergenSelectArea color="#dfa8ff" title="除去可能">
									<div
										ref={removableAreaElement}
										className={css`
											display: flex;
											flex-wrap: wrap;
										`}
									>
										{getAllergensResponse?.map((allergen) => {
											if (allergenStatus[allergen.id] === "removable") {
												return (
													<div
														key={allergen.id}
														className={css`
															cursor: grab;

															* {
																user-select: none;
																pointer-events: none;
															}
														`}
														data-hold-allergen
														data-allergen={allergen.id}
													>
														<AllergenItem
															image={`/icons/${allergen.id}.png`}
															text={allergen.name}
														/>
													</div>
												);
											}

											return "";
										})}
									</div>
								</AllergenSelectArea>
								<AllergenSelectArea color="#b6e2ff" title="含まれない">
									<div
										ref={notContainedAreaElement}
										className={css`
											display: flex;
											flex-wrap: wrap;
										`}
									>
										{getAllergensResponse?.map((allergen) => {
											if (allergenStatus[allergen.id] === "not contained") {
												return (
													<div
														key={allergen.id}
														className={css`
															cursor: grab;

															* {
																user-select: none;
																pointer-events: none;
															}
														`}
														data-hold-allergen
														data-allergen={allergen.id}
													>
														<AllergenItem
															image={`/icons/${allergen.id}.png`}
															text={allergen.name}
														/>
													</div>
												);
											}

											return "";
										})}
									</div>
								</AllergenSelectArea>
							</div>
						</div>
					</div>
				</div>
			</Modal>
		</>
	);
}
