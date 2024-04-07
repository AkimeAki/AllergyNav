"use client";

import { css } from "@kuma-ui/core";
import SubTitle from "@/components/atoms/SubTitle";
import { useEffect, useState } from "react";
import Button from "@/components/atoms/Button";
import { useSearchParams } from "next/navigation";
import useGetAllergens from "@/hooks/useGetAllergens";
import GoogleIcon from "@/components/atoms/GoogleIcon";
import AllergenItem from "@/components/atoms/AllergenItem";
import Modal from "@/components/molecules/Modal";
import MiniTitle from "@/components/atoms/MiniTitle";

export default function (): JSX.Element {
	const [selectAllergens, setSelectAllergens] = useState<string[]>([]);
	const [keywords, setKeywords] = useState<string>("");
	const [isAllergenSelectModalOpen, setIsAllergenSelectModalOpen] = useState<boolean>(false);
	const [isSpSelectModalOpen, setIsSpModalOpen] = useState<boolean>(false);
	const searchParams = useSearchParams();
	const { response: allergens, getAllergens, loading: getAllergensLoading } = useGetAllergens();

	const params = {
		allergens: searchParams.get("allergens"),
		keywords: searchParams.get("keywords")
	};

	useEffect(() => {
		void getAllergens();
	}, []);

	useEffect(() => {
		if (params.allergens !== null) {
			const queryAllergenList = params.allergens.split(",");
			const filterdAllergenList = queryAllergenList.filter((a) => {
				return allergens.some((b) => a === b.id);
			});
			setSelectAllergens(filterdAllergenList);
		} else {
			setSelectAllergens([]);
		}

		setKeywords(params.keywords ?? "");
	}, [searchParams, allergens]);

	return (
		<aside
			className={css`
				display: flex;
				flex-direction: column;
				gap: 30px;

				@media (max-width: 880px) {
					position: sticky;
					top: 0;
					z-index: 99;
					background-color: white;
					border-bottom: 2px solid #d3d3d3;
					padding: 5px 10px;
					width: calc(100% + 30px + 30px);
					margin-left: -30px;
					gap: 5px;
				}

				@media (max-width: 600px) {
					width: calc(100% + 20px + 20px);
					margin-left: -20px;
				}

				& > div {
					display: flex;
					flex-direction: column;
					gap: 10px;
				}
			`}
		>
			<div
				className={css`
					position: relative;

					@media (max-width: 880px) {
						order: 2;
					}
				`}
			>
				<div
					className={css`
						@media (max-width: 880px) {
							display: none;
						}
					`}
				>
					<SubTitle>検索</SubTitle>
				</div>
				<div
					className={css`
						@media (max-width: 880px) {
							display: none;
						}
					`}
				>
					<MiniTitle>アレルゲン</MiniTitle>
				</div>
				<div
					className={css`
						@media (max-width: 880px) {
							display: none;
						}
					`}
				>
					<div
						className={css`
							display: flex;
							flex-wrap: wrap;
							width: 100%;
							justify-content: left;
							gap: 10px;
						`}
					>
						<Modal isOpen={isAllergenSelectModalOpen} setIsOpen={setIsAllergenSelectModalOpen}>
							<div
								className={css`
									display: flex;
									flex-direction: column;
									gap: 20px;
								`}
							>
								<SubTitle>含まれていないアレルゲンを選択</SubTitle>
								<div
									className={css`
										display: flex;
										flex-wrap: wrap;
										gap: 20px;
										width: 100%;
									`}
								>
									{allergens.map((item) => {
										const selected = selectAllergens.some(
											(selectAllergen) => selectAllergen === item.id
										);

										return (
											<div
												key={item.id}
												onClick={() => {
													setSelectAllergens((selectAllergens) => {
														if (selected) {
															return [...selectAllergens].filter((selectAllergen) => {
																return selectAllergen !== item.id;
															});
														}

														return [...selectAllergens, item.id];
													});
												}}
												className={css`
													cursor: pointer;
													user-select: none;
												`}
											>
												<AllergenItem
													image={`/icons/${item.id}.png`}
													text={item.name}
													selected={selected}
													icon={
														<div
															className={css`
																position: absolute;
																top: 50%;
																left: 50%;
																transform: translate(-50%, -50%);
															`}
														>
															<GoogleIcon
																name="skull"
																size={40}
																color="var(--color-red)"
															/>
														</div>
													}
												/>
											</div>
										);
									})}
								</div>
							</div>
						</Modal>
						<div
							className={css`
								display: flex;
								flex-direction: column;
								gap: 10px;
							`}
						>
							<div>
								<Button
									onClick={() => {
										setIsAllergenSelectModalOpen(true);
									}}
									size="small"
									selected={isAllergenSelectModalOpen}
									disabled={getAllergensLoading}
								>
									選択する
								</Button>
							</div>
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
					</div>
				</div>
				<div
					className={css`
						display: none;

						@media (max-width: 880px) {
							display: block;
						}
					`}
				>
					<div
						className={css`
							display: flex;
							flex-wrap: wrap;
							height: 35px;
						`}
					>
						{selectAllergens.map((item) => {
							let name = "";
							allergens.forEach((allergen) => {
								if (item === allergen.id) {
									name = allergen.name;
								}
							});

							return (
								<AllergenItem
									key={item}
									image={`/icons/${item}.png`}
									text={name}
									nameHidden
									size={30}
								/>
							);
						})}
					</div>
				</div>
				<div
					onClick={() => {
						setIsSpModalOpen((status) => {
							return !status;
						});
					}}
					className={css`
						display: none;
						position: absolute;
						top: 50%;
						transform: translateY(-50%);
						right: 0;
						cursor: pointer;
						user-select: none;

						& > div {
							vertical-align: bottom;
						}

						@media (max-width: 880px) {
							display: block;
						}
					`}
				>
					<GoogleIcon name="page_info" size={25} color="var(--color-orange)" />
				</div>
			</div>
			<div
				className={css`
					@media (max-width: 880px) {
						order: 1;
					}
				`}
			>
				<div
					className={css`
						@media (max-width: 880px) {
							display: none;
						}
					`}
				>
					<MiniTitle>キーワード検索</MiniTitle>
				</div>
				<div
					className={css`
						display: flex;
						flex-direction: column;
						gap: 5px;

						@media (max-width: 880px) {
							flex-direction: row;
						}
					`}
				>
					<input
						type="text"
						placeholder="キーワードを入力してお店を検索"
						value={keywords}
						onChange={(e) => {
							setKeywords(e.target.value);
						}}
						className={css`
							display: block;
							width: 100%;
							padding: 5px 20px;
							border-style: solid;
							border-color: var(--color-orange);
							border-width: 1px;
							border-radius: 30px;
							transition-duration: 200ms;
							transition-property: box-shadow;
							font-size: 15px;

							&:focus {
								box-shadow: 0 0 0 1px var(--color-orange);
							}
						`}
					/>
					<div
						className={css`
							display: flex;
							flex-direction: column;

							@media (max-width: 880px) {
								display: block;
							}
						`}
					>
						<Button
							size="small"
							href={`/store?keywords=${keywords}&allergens=${selectAllergens.join(",")}`}
						>
							検索
						</Button>
					</div>
				</div>
			</div>
			{isSpSelectModalOpen && (
				<div
					className={css`
						order: 3;
						padding-bottom: 20px;

						@media (max-width: 880px) {
							display: none;
						}
					`}
				>
					<div
						className={css`
							display: flex;
							flex-direction: column;
							gap: 20px;
						`}
					>
						<MiniTitle>含まれていないアレルゲンを選択</MiniTitle>
						<div
							className={css`
								display: flex;
								flex-wrap: wrap;
								gap: 10px;
								width: 100%;
							`}
						>
							{allergens.map((item) => {
								const selected = selectAllergens.some((selectAllergen) => selectAllergen === item.id);

								return (
									<div
										key={item.id}
										onClick={() => {
											setSelectAllergens((selectAllergens) => {
												if (selected) {
													return [...selectAllergens].filter((selectAllergen) => {
														return selectAllergen !== item.id;
													});
												}

												return [...selectAllergens, item.id];
											});
										}}
										className={css`
											cursor: pointer;
											user-select: none;
										`}
									>
										<AllergenItem
											image={`/icons/${item.id}.png`}
											text={item.name}
											selected={selected}
											icon={
												<div
													className={css`
														position: absolute;
														top: 50%;
														left: 50%;
														transform: translate(-50%, -50%);
													`}
												>
													<GoogleIcon name="skull" size={40} color="var(--color-red)" />
												</div>
											}
										/>
									</div>
								);
							})}
						</div>
					</div>
				</div>
			)}
		</aside>
	);
}
