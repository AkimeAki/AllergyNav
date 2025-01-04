"use client";

import { css } from "@kuma-ui/core";
import { useEffect, useRef, useState } from "react";
import Button from "@/components/atoms/Button";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import useGetAllergens from "@/hooks/fetch-api/useGetAllergens";
import AllergenItem from "@/components/atoms/AllergenItem";
import Select from "@/components/atoms/Select";
import GoogleAds from "@/components/atoms/GoogleAds";
import { useFloatMessage } from "@/hooks/useFloatMessage";
import { safeNumber } from "@/libs/safe-type";
import InputButton from "@/components/atoms/InputButton";
import LoadingCircleCenter from "@/components/atoms/LoadingCircleCenter";
import SmallModal from "@/components/molecules/SmallModal";
import InputText from "@/components/atoms/InputText";
import GoogleIcon from "@/components/atoms/GoogleIcon";
import { searchArea } from "@/definition";
import { isEmptyString } from "@/libs/check-string";

export default function (): JSX.Element {
	const [selectAllergens, setSelectAllergens] = useState<string[]>([]);
	const [keywords, setKeywords] = useState<string>("");
	const [area, setArea] = useState<string>("all");
	const [radius, setRadius] = useState<string | undefined>(undefined);
	const [isSidebarAllergenSelectModalOpen, setIsSidebarAllergenSelectModalOpen] = useState<boolean>(false);
	const [isHeaderAllergenSelectModalOpen, setIsHeaderAllergenSelectModalOpen] = useState<boolean>(false);
	const [isAreaSelectModalOpen, setIsAreaSelectModalOpen] = useState<boolean>(false);
	const searchParams = useSearchParams();
	const { getAllergensResponse, getAllergens, getAllergensStatus } = useGetAllergens();
	const router = useRouter();
	const pathname = usePathname();
	const { addMessage } = useFloatMessage();
	const selectSidebarAllergensButton = useRef<HTMLDivElement | null>(null);
	const selectHeaderAllergensButton = useRef<HTMLDivElement | null>(null);
	const selectAreaButton = useRef<HTMLDivElement | null>(null);

	const params = {
		allergens: searchParams.get("allergens") ?? "",
		keywords: searchParams.get("keywords") ?? "",
		area: isEmptyString(searchParams.get("area") ?? "all") ? "all" : (searchParams.get("area") ?? "all"),
		radius: searchParams.get("radius") ?? "",
		page: safeNumber(searchParams.get("page")) ?? 1
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
		setArea(params.area);
		setRadius(params.radius);
	}, [searchParams]);

	useEffect(() => {
		if (area !== undefined) {
			if (area === "location" && params.radius === "") {
				setRadius("2.5");
			}

			if (area !== "location") {
				setRadius("");
			}
		}

		if (searchArea[area] === undefined || searchArea[area] === "") {
			setArea("all");
		}
	}, [area]);

	const search = (): void => {
		if (keywords !== undefined && selectAllergens !== undefined && area !== undefined && radius !== undefined) {
			router.push(
				`/store?keywords=${keywords}&allergens=${selectAllergens.join(",")}&area=${area}&radius=${radius}`
			);
		}
	};

	return (
		<>
			{/* MARK: SP表示
			 */}
			<aside
				className={css`
					position: fixed;
					top: 60px;
					left: 0;
					width: 100%;
					height: 60px;
					padding: 0 30px;
					display: none;
					border-bottom: 1px solid var(--color-primary-thin);
					background-color: var(--color-secondary);
					z-index: 1;

					@media (max-width: 880px) {
						display: flex;
						align-items: center;
					}

					@media (max-width: 600px) {
						padding: 0 10px;
					}
				`}
			>
				<div
					className={css`
						display: flex;
						gap: 5px;
						width: 100%;
					`}
				>
					<div
						className={css`
							display: flex;
							gap: 5px;
							flex: 1;
						`}
					>
						<div
							className={css`
								width: 50%;
							`}
						>
							<InputButton
								ref={selectHeaderAllergensButton}
								isOpen={isHeaderAllergenSelectModalOpen}
								setIsOpen={setIsHeaderAllergenSelectModalOpen}
								focus={isHeaderAllergenSelectModalOpen}
							>
								{selectAllergens.length === 0 && "アレルギー選択"}
								{selectAllergens.length !== 0 && (
									<>
										{(getAllergensResponse ?? [])
											.filter((allergen) => {
												return selectAllergens.includes(allergen.id);
											})
											.map((allergen) => allergen.name)
											.join(", ")}
									</>
								)}
							</InputButton>
						</div>
						<div
							className={css`
								width: 50%;

								input {
									width: 100%;
								}
							`}
						>
							<InputText
								placeholder="店名、ジャンルなど"
								value={keywords}
								onChange={(e) => {
									setKeywords(e.target.value);
								}}
							/>
						</div>
					</div>
					<div>
						<div
							onClick={() => {
								search();
								addMessage("未実装です。", "error");
							}}
							className={css`
								display: flex;
								flex-direction: column;
								justify-content: center;
								align-items: center;
								border: 1px solid #a7a7a7;
								border-radius: 4px;
								padding: 7px 5px;
								height: 40px;
								background-color: var(--color-secondary);
								color: var(--color-primary);
								align-content: center;
								cursor: pointer;
								user-select: none;
							`}
						>
							<GoogleIcon name={"page_info"} size={20} color="inherit" />
							<span
								className={css`
									font-size: 12px;
									white-space: nowrap;
								`}
							>
								その他
							</span>
						</div>
					</div>
					<div>
						<Button
							size="small"
							onClick={() => {
								search();
							}}
							disabled={
								getAllergensStatus === "loading" ||
								selectAllergens === undefined ||
								setArea === undefined ||
								setRadius === undefined
							}
							loading={
								getAllergensStatus === "loading" ||
								selectAllergens === undefined ||
								setArea === undefined ||
								setRadius === undefined
							}
						>
							検索
						</Button>
					</div>
				</div>
			</aside>

			{/* MARK: PC表示
			 */}

			<aside
				className={css`
					display: flex;
					flex-direction: column;
					gap: 20px;

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
						border: 3px solid #f1f1f1;
						padding: 10px;
						border-radius: 4px;

						h2 {
							font-size: 15px;
							font-weight: bold;
						}

						& > div {
							display: flex;
							flex-direction: column;
							gap: 10px;
						}
					`}
				>
					<div>
						<h2>アレルギー</h2>
						<InputButton
							ref={selectSidebarAllergensButton}
							isOpen={isSidebarAllergenSelectModalOpen}
							setIsOpen={setIsSidebarAllergenSelectModalOpen}
							focus={isSidebarAllergenSelectModalOpen}
						>
							{selectAllergens.length === 0 && "選択なし"}
							{selectAllergens.length !== 0 && (
								<>
									{(getAllergensResponse ?? [])
										.filter((allergen) => {
											return selectAllergens.includes(allergen.id);
										})
										.map((allergen) => allergen.name)
										.join(", ")}
								</>
							)}
						</InputButton>
					</div>
					<div>
						<h2>エリア</h2>
						<InputButton
							ref={selectAreaButton}
							isOpen={isAreaSelectModalOpen}
							setIsOpen={setIsAreaSelectModalOpen}
							focus={isAreaSelectModalOpen}
						>
							{searchArea[area]}
						</InputButton>
						{area === "location" && (
							<div
								className={css`
									display: flex;
									flex-direction: column;
								`}
							>
								<Select
									value={radius}
									disabled={radius === undefined}
									onChange={(e) => {
										setRadius(e.target.value);
									}}
								>
									<option value="0.3">300m</option>
									<option value="0.5">500m</option>
									<option value="1">1km</option>
									<option value="1.5">1.5km</option>
									<option value="2">2km</option>
									<option value="2.5">2.5km</option>
									<option value="3">3km</option>
									<option value="5">5km</option>
									<option value="10">10km</option>
								</Select>
							</div>
						)}
					</div>
					<div>
						<h2>キーワード</h2>
						<InputText
							placeholder="店名、ジャンルなど"
							value={keywords}
							onChange={(e) => {
								setKeywords(e.target.value);
							}}
						/>
					</div>
					<div>
						<Button
							size="small"
							onClick={() => {
								search();
							}}
							disabled={
								getAllergensStatus === "loading" ||
								selectAllergens === undefined ||
								setArea === undefined ||
								setRadius === undefined
							}
							loading={
								getAllergensStatus === "loading" ||
								selectAllergens === undefined ||
								setArea === undefined ||
								setRadius === undefined
							}
						>
							検索
						</Button>
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
			</aside>
			<SmallModal
				isOpen={isSidebarAllergenSelectModalOpen}
				setIsOpen={setIsSidebarAllergenSelectModalOpen}
				targetElement={selectSidebarAllergensButton.current}
				title="アレルギーを選択"
			>
				{getAllergensStatus === "loading" && <LoadingCircleCenter />}
				<div
					className={css`
						display: grid;
						grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
						gap: 5px;
					`}
				>
					{(getAllergensResponse ?? []).map((allergen) => (
						<div
							key={allergen.id}
							onClick={() => {
								setSelectAllergens((selectAllergens) => {
									if (selectAllergens.includes(allergen.id)) {
										return [...selectAllergens].filter((selectAllergen) => {
											return selectAllergen !== allergen.id;
										});
									} else {
										return [...selectAllergens, allergen.id];
									}
								});
							}}
							className={[
								css`
									display: flex;
									justify-content: center;
									cursor: pointer;
									border-radius: 4px;
									border: 1px solid var(--color-primary);
									padding: 3px;
								`,
								selectAllergens.includes(allergen.id)
									? css`
											outline: 2px solid var(--color-theme);
											outline-offset: -1px;
										`
									: ""
							].join(" ")}
						>
							<AllergenItem image={`/icons/${allergen.id}.png`} text={allergen.name} />
						</div>
					))}
				</div>
			</SmallModal>
			<SmallModal
				isOpen={isHeaderAllergenSelectModalOpen}
				setIsOpen={setIsHeaderAllergenSelectModalOpen}
				targetElement={selectHeaderAllergensButton.current}
				title="アレルギーを選択"
			>
				{getAllergensStatus === "loading" && <LoadingCircleCenter />}
				<div
					className={css`
						display: grid;
						grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
						gap: 5px;
					`}
				>
					{(getAllergensResponse ?? []).map((allergen) => (
						<div
							key={allergen.id}
							onClick={() => {
								setSelectAllergens((selectAllergens) => {
									if (selectAllergens.includes(allergen.id)) {
										return [...selectAllergens].filter((selectAllergen) => {
											return selectAllergen !== allergen.id;
										});
									} else {
										return [...selectAllergens, allergen.id];
									}
								});
							}}
							className={[
								css`
									display: flex;
									justify-content: center;
									cursor: pointer;
									border-radius: 4px;
									border: 1px solid var(--color-primary);
									padding: 3px;
								`,
								selectAllergens.includes(allergen.id)
									? css`
											outline: 2px solid var(--color-theme);
											outline-offset: -1px;
										`
									: ""
							].join(" ")}
						>
							<AllergenItem image={`/icons/${allergen.id}.png`} text={allergen.name} />
						</div>
					))}
				</div>
			</SmallModal>
			<SmallModal
				isOpen={isAreaSelectModalOpen}
				setIsOpen={setIsAreaSelectModalOpen}
				targetElement={selectAreaButton.current}
				title="エリアを選択"
			>
				<div
					className={css`
						display: grid;
						grid-template-columns: 1fr;
						gap: 5px;

						& > div {
							cursor: pointer;
							padding: 13px 10px;
							font-size: 15px;

							&:hover {
								background-color: var(--color-theme-thin);
							}
						}
					`}
				>
					<div
						onClick={() => {
							setArea("all");
							setIsAreaSelectModalOpen(false);
						}}
					>
						全エリア
					</div>
					<div
						onClick={() => {
							setArea("location");
							setIsAreaSelectModalOpen(false);
						}}
					>
						現在地周辺
					</div>
				</div>
			</SmallModal>
		</>
	);
}
