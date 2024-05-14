"use client";

import { css } from "@kuma-ui/core";
import { usePathname, useSearchParams } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/atoms/Button";
import AddStoreModal from "@/components/organisms/modal/AddStoreModal";
import useGetStores from "@/hooks/fetch-api/useGetStores";
import useGetAllergens from "@/hooks/fetch-api/useGetAllergens";
import AllergenItem from "@/components/atoms/AllergenItem";
import MiniTitle from "@/components/atoms/MiniTitle";
import useGetUserData from "@/hooks/useGetUserData";
import useGetPictures from "@/hooks/fetch-api/useGetPictures";
import LoadingEffect from "../atoms/LoadingEffect";
import { safeString } from "@/libs/safe-type";
import { isEmptyString } from "@/libs/check-string";
import { useFloatMessage } from "@/hooks/useFloatMessage";
import NotVerifiedModal from "@/components/molecules/NotVerifiedModal";
import NotLoginedModal from "@/components/molecules/NotLoginedModal";
import LoadingCircleCenter from "@/components/atoms/LoadingCircleCenter";

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
	const pathname = usePathname();
	const params = {
		allergens: searchParams.get("allergens") ?? "",
		keywords: searchParams.get("keywords") ?? "",
		area: isEmptyString(safeString(searchParams.get("area")) ?? "")
			? "all"
			: safeString(searchParams.get("area")) ?? "all",
		radius: safeString(searchParams.get("radius")) ?? ""
	};

	useEffect(() => {
		if (
			currentLatitude !== null &&
			currentLongitude !== null &&
			!(params.area === "location" && currentLatitude === undefined && currentLongitude === undefined)
		) {
			const coords = (safeString(currentLatitude) ?? "") + "," + (safeString(currentLongitude) ?? "");
			getStores(params.allergens, params.keywords, params.area, coords, params.radius);
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
			getPictures(getStoresResponse.map((store) => store.id).join(","));
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
						<div
							className={css`
								border: 4px solid var(--color-theme);
								padding: 10px;
								background-color: var(--color-theme-thin);
								border-radius: 10px;
								display: flex;
								flex-direction: column;
								gap: 5px;
							`}
						>
							<div
								className={css`
									display: flex;
									gap: 5px;
									justify-content: center;
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
						</div>
					)}
				{(getStoresStatus === "loading" || getStoresStatus === "yet") && <LoadingCircleCenter />}
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
							{getStoresResponse.length === 0 && (
								<p
									className={css`
										text-align: center;
									`}
								>
									お店が無いようです😿
								</p>
							)}
							{[...getStoresResponse].reverse().map((store, index) => (
								<Fragment key={store.id}>
									<div
										className={css`
											position: relative;
											transition-duration: 200ms;
											transition-property: box-shadow;
											overflow: hidden;
											border-radius: 7px;
											border-width: 2px;
											border-style: solid;
											border-color: #f3f3f3;

											&:hover {
												box-shadow: 0px 0px 15px -10px #777777;
											}
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
													`}
												>
													<LoadingEffect />
												</div>
												{getPicturesStatus === "successed" && (
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
														src={
															getPicturesResponse?.find((p) => p.store_id === store.id)
																?.url ?? "/no-image.png"
														}
														width={250}
														height={250}
														alt={`${store.name}の画像`}
													/>
												)}
											</div>
											<div
												className={css`
													padding: 10px;
													width: 100%;
													display: flex;
													flex-direction: column;
													gap: 20px;
												`}
											>
												<div>
													<MiniTitle>{store.name}</MiniTitle>
												</div>
												<div>{store.description}</div>
											</div>
										</div>
										<Link
											className={css`
												display: block;
												position: absolute;
												top: 0;
												left: 0;
												width: 100%;
												height: 100%;
												z-index: 99;
											`}
											href={`/store/${store.id}`}
										/>
									</div>
									{index !== 0 && index !== getStoresResponse.length - 1 && index % 5 === 0 && (
										<div
											key={pathname}
											className={css`
												* {
													width: 100% !important;
													max-height: 90px !important;
												}

												@media (max-width: 880px) {
													grid-column: 1 / 3;
												}

												@media (max-width: 700px) {
													grid-column: 1 / 1;
												}
											`}
										>
											<script
												async
												src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6914867149724943"
												crossOrigin="anonymous"
											/>
											<ins
												className="adsbygoogle"
												style={{ display: "block" }}
												data-ad-client="ca-pub-6914867149724943"
												data-ad-slot="5973440772"
												data-ad-format="auto"
												data-full-width-responsive="true"
											/>
										</div>
									)}
								</Fragment>
							))}
						</>
					)}
				</section>
				<div
					className={css`
						position: sticky;
						bottom: 40px;
						text-align: right;
						z-index: 99;
						animation-name: addStoreButtonFadeIn;
						opacity: 0;
						animation-iteration-count: 1;
						animation-duration: 200ms;
						animation-fill-mode: forwards;

						@keyframes addStoreButtonFadeIn {
							0% {
								opacity: 0;
							}

							100% {
								opacity: 1;
							}
						}

						@media (max-width: 600px) {
							bottom: 20px;
						}
					`}
				>
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
				</div>
			</div>
		</>
	);
}
