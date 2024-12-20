"use client";

import { css } from "@kuma-ui/core";
import SubTitle from "@/components/atoms/SubTitle";
import { useEffect, useState } from "react";
import Button from "@/components/atoms/Button";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import useGetAllergens from "@/hooks/fetch-api/useGetAllergens";
import GoogleIcon from "@/components/atoms/GoogleIcon";
import AllergenItem from "@/components/atoms/AllergenItem";
import Modal from "@/components/molecules/Modal";
import MiniTitle from "@/components/atoms/MiniTitle";
import TextInput from "@/components/atoms/TextInput";
import Select from "@/components/atoms/Select";
import { isEmptyString } from "@/libs/check-string";
import GoogleAds from "@/components/atoms/GoogleAds";

export default function (): JSX.Element {
	const [selectAllergens, setSelectAllergens] = useState<string[] | undefined>(undefined);
	const [keywords, setKeywords] = useState<string | undefined>(undefined);
	const [isAllergenSelectModalOpen, setIsAllergenSelectModalOpen] = useState<boolean>(false);
	const [isSpModalOpen, setIsSpModalOpen] = useState<boolean>(false);
	const searchParams = useSearchParams();
	const { getAllergensResponse, getAllergens, getAllergensStatus } = useGetAllergens();
	const router = useRouter();
	const pathname = usePathname();

	const params = {
		allergens: searchParams.get("allergens") ?? "",
		keywords: searchParams.get("keywords") ?? ""
	};

	useEffect(() => {
		getAllergens();
	}, []);

	useEffect(() => {
		if (getAllergensStatus === "successed") {
			const queryAllergens = params.allergens.split(",");
			const filterdAllergens = queryAllergens.filter((a) => {
				return getAllergensResponse?.some((b) => a === b.id);
			});
			setSelectAllergens(filterdAllergens);
		} else {
			setSelectAllergens([]);
		}
	}, [searchParams, getAllergensStatus]);

	useEffect(() => {
		setKeywords(params.keywords);
	}, [searchParams]);

	const search = (): void => {
		if (keywords !== undefined && selectAllergens !== undefined) {
			router.push(`/vendor?keywords=${keywords}&allergens=${selectAllergens.join(",")}`);
		}
	};

	return (
		<>
			<Modal isOpen={isSpModalOpen} setIsOpen={setIsSpModalOpen}>
				<div
					className={css`
						display: flex;
						flex-direction: column;
						gap: 20px;
					`}
				>
					<SubTitle>検索したいアレルゲンを選択</SubTitle>
					<div
						className={css`
							display: flex;
							flex-wrap: wrap;
							gap: 20px;
							width: 100%;
						`}
					>
						{getAllergensResponse?.map((item) => {
							const selected = (selectAllergens ?? []).some(
								(selectAllergen) => selectAllergen === item.id
							);

							return (
								<div
									key={item.id}
									onClick={() => {
										setSelectAllergens((selectAllergens) => {
											if (selected) {
												return [...(selectAllergens ?? [])].filter((selectAllergen) => {
													return selectAllergen !== item.id;
												});
											}

											return [...(selectAllergens ?? []), item.id];
										});
									}}
									className={css`
										cursor: pointer;
										user-select: none;
									`}
								>
									<AllergenItem image={`/icons/${item.id}.png`} text={item.name} />
								</div>
							);
						})}
					</div>
					<div
						className={css`
							display: flex;
							flex-direction: column;
						`}
					>
						<Button
							size="small"
							onClick={() => {
								setIsSpModalOpen(false);
								search();
							}}
							disabled={
								getAllergensStatus === "loading" ||
								selectAllergens === undefined ||
								setKeywords === undefined
							}
							loading={
								getAllergensStatus === "loading" ||
								selectAllergens === undefined ||
								setKeywords === undefined
							}
						>
							検索
						</Button>
					</div>
				</div>
			</Modal>
			<Modal isOpen={isAllergenSelectModalOpen} setIsOpen={setIsAllergenSelectModalOpen}>
				<div
					className={css`
						display: flex;
						flex-direction: column;
						gap: 20px;
					`}
				>
					<SubTitle>検索したいアレルゲンを選択</SubTitle>
					<div
						className={css`
							display: flex;
							flex-wrap: wrap;
							gap: 20px;
							width: 100%;
						`}
					>
						{getAllergensResponse?.map((item) => {
							const selected = (selectAllergens ?? []).some(
								(selectAllergen) => selectAllergen === item.id
							);

							return (
								<div
									key={item.id}
									onClick={() => {
										setSelectAllergens((selectAllergens) => {
											if (selected) {
												return [...(selectAllergens ?? [])].filter((selectAllergen) => {
													return selectAllergen !== item.id;
												});
											}

											return [...(selectAllergens ?? []), item.id];
										});
									}}
									className={css`
										cursor: pointer;
										user-select: none;
									`}
								>
									<AllergenItem image={`/icons/${item.id}.png`} text={item.name} />
								</div>
							);
						})}
					</div>
				</div>
			</Modal>
			<aside
				className={css`
					display: flex;
					flex-direction: column;
					gap: 10px;

					@media (max-width: 880px) {
						display: none;
					}
				`}
			>
				<div>
					<SubTitle>検索</SubTitle>
				</div>
				<div
					className={css`
						display: flex;
						flex-direction: column;
						gap: 20px;
					`}
				>
					<div
						className={css`
							display: flex;
							flex-direction: column;
							gap: 10px;
						`}
					>
						<div>
							<MiniTitle>アレルゲン</MiniTitle>
						</div>
						<div>
							<div>
								<div
									className={css`
										display: flex;
										flex-direction: column;
										gap: 10px;
									`}
								>
									<div
										className={css`
											display: flex;
											flex-direction: column;
										`}
									>
										<Button
											onClick={() => {
												setIsAllergenSelectModalOpen(true);
											}}
											size="small"
											selected={isAllergenSelectModalOpen}
											disabled={
												getAllergensStatus !== "successed" || selectAllergens === undefined
											}
											loading={
												getAllergensStatus === "loading" ||
												getAllergensStatus === "yet" ||
												selectAllergens === undefined
											}
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
										{selectAllergens?.map((item) => {
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
							</div>
						</div>
					</div>
					<div
						className={css`
							display: flex;
							flex-direction: column;
							gap: 10px;
						`}
					>
						<div>
							<MiniTitle>キーワード検索</MiniTitle>
						</div>
						<div
							className={css`
								display: flex;
								flex-direction: column;
								gap: 10px;
							`}
						>
							<TextInput
								placeholder="キーワードを入力してお店を検索"
								value={keywords}
								disabled={keywords === undefined}
								onChange={(e) => {
									setKeywords(e.target.value);
								}}
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
									onClick={() => {
										search();
									}}
									disabled={
										getAllergensStatus === "loading" ||
										selectAllergens === undefined ||
										setKeywords === undefined
									}
									loading={
										getAllergensStatus === "loading" ||
										selectAllergens === undefined ||
										setKeywords === undefined
									}
								>
									検索
								</Button>
							</div>
						</div>
					</div>
					<div
						key={pathname}
						className={css`
							text-align: center;

							@media (max-width: 880px) {
								display: none;
							}
						`}
					>
						<GoogleAds
							slot="7661038914"
							style={css`
								width: 220px;
								height: 600px;
							`}
						/>
					</div>
				</div>
			</aside>
			<aside
				className={css`
					display: none;

					@media (max-width: 880px) {
						display: block;
						position: sticky;
						top: 0;
						z-index: 100;
						background-color: var(--color-secondary);
						border-bottom: 2px solid #d3d3d3;
						padding: 0 10px;
						width: calc(100% + 30px + 30px);
						margin-left: -30px;
						gap: 5px;
					}

					@media (max-width: 600px) {
						width: calc(100% + 20px + 20px);
						margin-left: -20px;
					}
				`}
			>
				<div>
					<div
						className={css`
							display: flex;
							flex-direction: row;
							gap: 5px;
							padding-top: 5px;
						`}
					>
						<TextInput
							placeholder="キーワードを入力してお店を検索"
							value={keywords}
							onChange={(e) => {
								setKeywords(e.target.value);
							}}
						/>
						<div
							className={css`
								display: flex;
								flex-direction: column;
							`}
						>
							<Button
								size="small"
								onClick={() => {
									search();
								}}
								disabled={
									getAllergensStatus === "loading" ||
									selectAllergens === undefined ||
									setKeywords === undefined
								}
								loading={
									getAllergensStatus === "loading" ||
									selectAllergens === undefined ||
									setKeywords === undefined
								}
							>
								検索
							</Button>
						</div>
					</div>
				</div>
				<div
					className={css`
						display: flex;
						justify-content: space-between;
						height: 45px;
					`}
				>
					<div>
						<div
							className={css`
								display: flex;
								flex-wrap: wrap;
								align-items: center;
								height: 100%;
							`}
						>
							検索条件：
						</div>
					</div>
					<div
						className={css`
							display: flex;
							align-items: center;
						`}
					>
						<Button
							size="small"
							onClick={() => {
								setIsSpModalOpen(true);
							}}
						>
							検索オプション
						</Button>
					</div>
				</div>
			</aside>
		</>
	);
}
