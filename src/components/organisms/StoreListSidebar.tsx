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

export default function (): JSX.Element {
	const [selectAllergens, setSelectAllergens] = useState<string[] | undefined>(undefined);
	const [keywords, setKeywords] = useState<string | undefined>(undefined);
	const [area, setArea] = useState<string | undefined>(undefined);
	const [radius, setRadius] = useState<string | undefined>(undefined);
	const [isAllergenSelectModalOpen, setIsAllergenSelectModalOpen] = useState<boolean>(false);
	const [isSpModalOpen, setIsSpModalOpen] = useState<boolean>(false);
	const searchParams = useSearchParams();
	const { getAllergensResponse, getAllergens, getAllergensStatus } = useGetAllergens();
	const router = useRouter();
	const pathname = usePathname();

	const params = {
		allergens: searchParams.get("allergens") ?? "",
		keywords: searchParams.get("keywords") ?? "",
		area: isEmptyString(searchParams.get("area") ?? "") ? "all" : searchParams.get("area") ?? "all",
		radius: searchParams.get("radius") ?? ""
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
			<Modal isOpen={isSpModalOpen} setIsOpen={setIsSpModalOpen}>
				<div
					className={css`
						display: flex;
						flex-direction: column;
						gap: 20px;
					`}
				>
					<SubTitle>検索したいアレルゲンを選択</SubTitle>
					<div>
						<p>
							<span
								className={css`
									vertical-align: sub;
								`}
							>
								<GoogleIcon name="skull" size={25} color="var(--color-red)" />
							</span>
							で選択したアレルゲンが
							<span
								className={css`
									color: var(--color-red);
									font-weight: bold;
								`}
							>
								含まれていない
							</span>
							メニューを食べられるお店を検索します。
						</p>
					</div>
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
									<AllergenItem
										image={`/icons/${item.id}.png`}
										text={item.name}
										status={selected ? "skull" : "normal"}
									/>
								</div>
							);
						})}
					</div>
					<SubTitle>エリア選択</SubTitle>
					<div
						className={css`
							display: flex;
							flex-direction: column;
						`}
					>
						<Select
							value={area}
							disabled={area === undefined}
							onChange={(e) => {
								setArea(e.target.value);
							}}
						>
							<option value="all">全エリア</option>
							<option value="location">現在位置</option>
						</Select>
					</div>
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
					<div>
						<p>
							<span
								className={css`
									vertical-align: sub;
								`}
							>
								<GoogleIcon name="skull" size={25} color="var(--color-red)" />
							</span>
							で選択したアレルゲンが
							<span
								className={css`
									color: var(--color-red);
									font-weight: bold;
								`}
							>
								含まれていない
							</span>
							メニューを食べられるお店を検索します。
						</p>
					</div>
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
									<AllergenItem
										image={`/icons/${item.id}.png`}
										text={item.name}
										status={selected ? "skull" : "normal"}
									/>
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
							<MiniTitle>エリア選択</MiniTitle>
						</div>
						<div
							className={css`
								display: flex;
								flex-direction: column;
							`}
						>
							<Select
								value={area}
								disabled={area === undefined}
								loading={area === undefined}
								onChange={(e) => {
									setArea(e.target.value);
								}}
							>
								<option value="all">全エリア</option>
								<option value="location">現在位置</option>
							</Select>
						</div>
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
										setKeywords === undefined ||
										setArea === undefined ||
										setRadius === undefined
									}
									loading={
										getAllergensStatus === "loading" ||
										selectAllergens === undefined ||
										setKeywords === undefined ||
										setArea === undefined ||
										setRadius === undefined
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
						`}
					>
						<ins
							className="adsbygoogle"
							style={{ display: "inline-block", width: "220px", height: "600px" }}
							data-ad-client="ca-pub-6914867149724943"
							data-ad-slot="7661038914"
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
						z-index: 99;
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
									setKeywords === undefined ||
									setArea === undefined ||
									setRadius === undefined
								}
								loading={
									getAllergensStatus === "loading" ||
									selectAllergens === undefined ||
									setKeywords === undefined ||
									setArea === undefined ||
									setRadius === undefined
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
							検索条件：{area === "location" && "エリア"}
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
