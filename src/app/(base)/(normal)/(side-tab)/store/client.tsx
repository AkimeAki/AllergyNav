"use client";

import { css } from "@kuma-ui/core";
import { useSearchParams } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/atoms/Button";
import AddStoreModal from "@/components/organisms/modal/AddStoreModal";
import useGetStores from "@/hooks/fetch-api/useGetStores";
import useGetAllergens from "@/hooks/fetch-api/useGetAllergens";
import AllergenItem from "@/components/atoms/AllergenItem";
import useGetUserData from "@/hooks/useGetUserData";
import useGetPictures from "@/hooks/fetch-api/useGetPictures";
import { safeNumber, safeString } from "@/libs/safe-type";
import { isEmptyString } from "@/libs/check-string";
import { useFloatMessage } from "@/hooks/useFloatMessage";
import NotVerifiedModal from "@/components/molecules/NotVerifiedModal";
import NotLoginedModal from "@/components/molecules/NotLoginedModal";
import LoadingCircleCenter from "@/components/atoms/LoadingCircleCenter";
import GoogleAds from "@/components/atoms/GoogleAds";
import AlertBox from "@/components/atoms/AlertBox";
import HeaderItemArea from "@/components/organisms/HeaderItemArea";

export default function (): JSX.Element {
	const [isOpenAddModal, setIsOpenAddModal] = useState<boolean>(false);
	const searchParams = useSearchParams();
	const [searchAllergens, setSearchAllergens] = useState<string[]>([]);
	const [currentLatitude, setCurrentLatitude] = useState<number | undefined | null>(undefined);
	const [currentLongitude, setCurrentLongitude] = useState<number | undefined | null>(undefined);
	const { getStoresResponse, getStoresStatus, getStores } = useGetStores();
	const { getAllergensResponse, getAllergens, getAllergensStatus } = useGetAllergens();
	const { userStatus, userId, userVerified } = useGetUserData();
	const { getPicturesResponse, getPicturesStatus, getPictures } = useGetPictures();
	const { addMessage } = useFloatMessage();
	const [resizeGoogleAdsToggle, setResizeGoogleAdsToggle] = useState<boolean>(false);
	const params = {
		allergens: searchParams.get("allergens") ?? "",
		keywords: searchParams.get("keywords") ?? "",
		area: isEmptyString(safeString(searchParams.get("area")) ?? "")
			? "all"
			: (safeString(searchParams.get("area")) ?? "all"),
		radius: safeString(searchParams.get("radius")) ?? "",
		page: safeNumber(searchParams.get("page")) ?? 1
	};

	useEffect(() => {
		if (
			currentLatitude !== null &&
			currentLongitude !== null &&
			!(params.area === "location" && currentLatitude === undefined && currentLongitude === undefined)
		) {
			const coords = (safeString(currentLatitude) ?? "") + "," + (safeString(currentLongitude) ?? "");
			getStores(params.allergens, params.keywords, params.area, coords, params.radius, params.page);
		}
	}, [searchParams, currentLatitude, currentLongitude]);

	useEffect(() => {
		getAllergens();
	}, []);

	useEffect(() => {
		if (getAllergensResponse !== undefined) {
			const queryAllergens = params.allergens.split(",");
			const filterdAllergens = queryAllergens.filter((a) => {
				return getAllergensResponse.some((b) => a === b.id);
			});
			setSearchAllergens(filterdAllergens);
		} else {
			setSearchAllergens([]);
		}
	}, [searchParams, getAllergensResponse]);

	useEffect(() => {
		if (getStoresStatus === "successed" && getStoresResponse !== undefined) {
			getPictures(getStoresResponse.data.map((store) => store.id).join(","));
		}
	}, [getStoresStatus]);

	useEffect(() => {
		if (params.area === "location") {
			if ("geolocation" in navigator) {
				navigator.geolocation.getCurrentPosition(
					(position) => {
						setCurrentLatitude(position.coords.latitude);
						setCurrentLongitude(position.coords.longitude);
					},
					(e) => {
						setCurrentLatitude(null);
						setCurrentLongitude(null);

						switch (e.code) {
							case 1:
								addMessage("位置情報が許可されていません", "error");
								break;

							case 2:
								addMessage("位置情報が判定できませんでした", "error");
								break;

							case 3:
								addMessage("位置情報の取得に時間がかかりすぎました", "error");
								break;
						}
					},
					{
						enableHighAccuracy: true,
						timeout: 10000,
						maximumAge: 0
					}
				);
			} else {
				setCurrentLatitude(null);
				setCurrentLongitude(null);
			}
		} else {
			setCurrentLatitude(undefined);
			setCurrentLongitude(undefined);
		}
	}, [searchParams]);

	useEffect(() => {
		const resize = (): void => {
			const mediaQuery = window.matchMedia("(max-width: 650px)");
			if (mediaQuery.matches) {
				setResizeGoogleAdsToggle(true);
			} else {
				setResizeGoogleAdsToggle(false);
			}
		};

		window.addEventListener("resize", resize, false);

		return () => {
			window.removeEventListener("resize", resize);
		};
	}, []);

	return (
		<>
			<AddStoreModal isOpen={isOpenAddModal && userVerified === true} setIsOpen={setIsOpenAddModal} />
			<NotVerifiedModal
				isOpen={isOpenAddModal && userVerified === false}
				setIsOpen={setIsOpenAddModal}
				userId={userId ?? ""}
			/>
			<NotLoginedModal
				isOpen={isOpenAddModal && userStatus === "unauthenticated"}
				setIsOpen={setIsOpenAddModal}
			/>
			<div
				className={css`
					display: flex;
					flex-direction: column;
					gap: 20px;
				`}
			>
				{getAllergensStatus === "successed" &&
					getAllergensResponse !== undefined &&
					searchAllergens.length !== 0 && (
						<AlertBox>
							<div
								className={css`
									display: flex;
									gap: 5px;
									justify-content: center;
									flex-wrap: wrap;
								`}
							>
								{searchAllergens.map((item) => {
									let name = "";
									getAllergensResponse.forEach((allergen) => {
										if (item === allergen.id) {
											name = allergen.name;
										}
									});

									return <AllergenItem key={item} image={`/icons/${item}.png`} text={name} />;
								})}
							</div>
							<div>
								<p
									className={css`
										text-align: center;
									`}
								>
									上記成分のアレルギーをお持ちの方が食べに行けるお店を表示しています。
								</p>
							</div>
						</AlertBox>
					)}
				{getStoresStatus === "successed" && getStoresResponse !== undefined && (
					<div
						className={css`
							display: flex;
							justify-content: space-between;
							align-items: flex-end;
						`}
					>
						<span
							className={css`
								display: flex;
								gap: 3px;
								align-items: flex-end;
							`}
						>
							<span
								className={css`
									font-weight: bold;
									font-size: 18px;
								`}
							>
								{getStoresResponse.info.total}
							</span>
							<span
								className={css`
									font-size: 15px;
								`}
							>
								件
							</span>
						</span>
						<span
							className={css`
								display: flex;
								gap: 3px;
								align-items: flex-end;
							`}
						>
							<span
								className={css`
									font-weight: bold;
									font-size: 18px;
								`}
							>
								{getStoresResponse.info.page}
							</span>
							<span
								className={css`
									font-size: 15px;
								`}
							>
								/
							</span>
							<span
								className={css`
									font-size: 15px;
								`}
							>
								{Math.floor(getStoresResponse.info.total / getStoresResponse.info.limit + 1)}
							</span>
							<span
								className={css`
									font-size: 15px;
								`}
							>
								ページ
							</span>
						</span>
					</div>
				)}
				{(getStoresStatus === "loading" || getStoresStatus === "yet") && <LoadingCircleCenter />}
				{getStoresStatus === "blocked" && (
					<div
						className={css`
							p {
								text-align: center;
							}
						`}
					>
						<p>API制限中</p>
						<p>時間を置いてからアクセスしてください。</p>
					</div>
				)}
				<section
					className={css`
						display: grid;
						grid-template-columns: 1fr;
						gap: 20px;
						flex-wrap: wrap;

						@media (max-width: 880px) {
							grid-template-columns: 1fr 1fr;
						}

						@media (max-width: 700px) {
							grid-template-columns: 1fr;
						}
					`}
				>
					{getStoresStatus === "successed" && getStoresResponse !== undefined && (
						<>
							{getStoresResponse.data.length === 0 && (
								<p
									className={css`
										text-align: center;
									`}
								>
									お店が見つかりませんでした
								</p>
							)}
							{[...getStoresResponse.data].reverse().map((store, index) => (
								<Fragment key={store.id}>
									<div
										className={css`
											position: relative;
											overflow: hidden;
											border-radius: 4px;
											border-width: 2px;
											border-style: solid;
											border-color: #f3f3f3;
										`}
									>
										<div
											className={css`
												display: flex;

												@media (max-width: 880px) {
													flex-direction: column;
												}
											`}
										>
											<div
												className={css`
													position: relative;
													aspect-ratio: 1/1;
													width: 250px;

													@media (max-width: 880px) {
														width: 100%;
														height: 250px;
													}
												`}
											>
												<div
													className={css`
														width: 100%;
														height: 100%;
														position: absolute;
														top: 0;
														left: 0;
														z-index: -1;
														background-color: #f5f5f5;

														@media (prefers-color-scheme: dark) {
															background-color: #555555;
														}
													`}
												/>
												{(() => {
													if (getPicturesStatus === "successed") {
														const imageUrl = getPicturesResponse?.find(
															(p) => p.store_id === store.id && p.menu_id !== undefined
														)?.url;

														if (imageUrl !== undefined) {
															return (
																<Image
																	className={css`
																		display: block;
																		width: 100%;
																		height: 100%;
																		object-fit: cover;

																		@media (max-width: 880px) {
																			object-fit: cover;
																		}
																	`}
																	src={imageUrl}
																	width={250}
																	height={250}
																	alt={`${store.name}の画像`}
																/>
															);
														}
													}

													return "";
												})()}
											</div>
											<div
												className={css`
													padding: 10px;
													width: 100%;
													display: flex;
													flex-direction: column;
													gap: 20px;
													justify-content: space-between;
												`}
											>
												<div
													className={css`
														display: flex;
														flex-direction: column;
														gap: 20px;
													`}
												>
													<div>
														<h2
															className={css`
																font-weight: bold;
																font-size: 18px;
																padding: 10px;
																user-select: none;
															`}
														>
															{store.name}
														</h2>
													</div>
													{store.description !== "" && <div>{store.description}</div>}
												</div>
												{store.labels.length !== 0 && (
													<div
														className={css`
															display: flex;
															flex-wrap: wrap;
															align-items: flex-start;
														`}
													>
														{store.labels.map((label) => (
															<div
																key={label.id}
																className={[
																	css`
																		font-size: 13px;
																		border: 2px solid var(--color-theme-thin);
																		border-radius: 8px;
																		background-color: var(--color-theme);
																		padding: 5px 10px;
																		color: var(--color-secondary);

																		@media (prefers-color-scheme: dark) {
																			font-weight: bold;
																		}
																	`,
																	!label.locked &&
																		css`
																			border-radius: 9999px;
																		`
																].join(" ")}
															>
																{label.name}
															</div>
														))}
													</div>
												)}
											</div>
										</div>
										<Link
											aria-label={`「${store.name}」のお店ページ`}
											className={css`
												display: block;
												position: absolute;
												top: 0;
												left: 0;
												width: 100%;
												height: 100%;
											`}
											href={`/store/${store.id}`}
										/>
									</div>
									{index !== 0 &&
										index !== getStoresResponse.data.length - 1 &&
										(index + 1) % 4 === 0 && (
											<>
												<div
													key={String(resizeGoogleAdsToggle)}
													className={css`
														text-align: center;

														@media (max-width: 880px) {
															grid-column: 1 / 3;
														}

														@media (max-width: 700px) {
															grid-column: 1 / 1;
														}

														@media (max-width: 650px) {
															display: none;
														}
													`}
												>
													<GoogleAds
														slot="5973440772"
														deps={[
															resizeGoogleAdsToggle,
															getStoresStatus,
															getStoresResponse
														]}
														style={css`
															width: 560px;
															height: 90px;
														`}
													/>
												</div>
												<div
													className={css`
														display: none;
														text-align: center;

														@media (max-width: 650px) {
															display: block;
														}
													`}
												>
													<GoogleAds
														slot="5973440772"
														deps={[
															resizeGoogleAdsToggle,
															getStoresStatus,
															getStoresResponse
														]}
														style={css`
															width: 300px;
															height: 150px;
														`}
													/>
												</div>
											</>
										)}
								</Fragment>
							))}
						</>
					)}
				</section>
				{getStoresStatus === "successed" && (
					<>
						<div
							className={css`
								display: flex;
								justify-content: space-between;
							`}
						>
							<Button
								disabled={
									getStoresStatus !== "successed" ||
									getStoresResponse === undefined ||
									params.page - 1 < 1
								}
								loading={getStoresStatus !== "successed" || getStoresResponse === undefined}
								href={
									params.page - 1 > 0
										? `/store?keywords=${params.keywords}&allergens=${params.allergens}&area=${params.area}&radius=${params.radius}&page=${params.page - 1}`
										: undefined
								}
							>
								前へ
							</Button>
							<Button
								disabled={
									getStoresStatus !== "successed" ||
									getStoresResponse === undefined ||
									(getStoresResponse !== undefined &&
										getStoresResponse.info.limit * getStoresResponse.info.page >
											getStoresResponse.info.total)
								}
								loading={getStoresStatus !== "successed" || getStoresResponse === undefined}
								href={
									getStoresResponse !== undefined &&
									getStoresResponse.info.limit * getStoresResponse.info.page >
										getStoresResponse.info.total
										? undefined
										: `/store?keywords=${params.keywords}&allergens=${params.allergens}&area=${params.area}&radius=${params.radius}&page=${params.page + 1}`
								}
							>
								次へ
							</Button>
						</div>
					</>
				)}
			</div>
			<HeaderItemArea>
				<Button
					onClick={() => {
						setIsOpenAddModal(true);
					}}
					disabled={userStatus === "loading"}
					loading={userStatus === "loading"}
					selected={isOpenAddModal}
				>
					お店を追加
				</Button>
			</HeaderItemArea>
		</>
	);
}
