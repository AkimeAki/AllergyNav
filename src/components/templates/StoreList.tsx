"use client";

import { css } from "@kuma-ui/core";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ErrorMessage from "@/components/atoms/ErrorMessage";
import Loading from "@/components/atoms/Loading";
import Button from "@/components/atoms/Button";
import AddStoreModal from "@/components/organisms/AddStoreModal";
import { useGetStores } from "@/hooks/useGetStores";
import Modal from "@/components/molecules/Modal";
import SubTitle from "@/components/atoms/SubTitle";
import useGetAllergens from "@/hooks/useGetAllergens";
import AllergenItem from "@/components/atoms/AllergenItem";
import MiniTitle from "@/components/atoms/MiniTitle";
import useGetUserData from "@/hooks/useGetUserData";
import useSendVerifyMail from "@/hooks/useSendVerifyMail";
import { useGetPictures } from "@/hooks/useGetPictures";
import LoadingEffect from "../atoms/LoadingEffect";
import { safeString } from "@/libs/safe-type";
import { isEmptyString } from "@/libs/check-string";
import { useFloatMessage } from "@/hooks/useFloatMessage";

export default function (): JSX.Element {
	const [isOpenAddModal, setIsOpenAddModal] = useState<boolean>(false);
	const searchParams = useSearchParams();
	const [searchAllergens, setSearchAllergens] = useState<string[]>([]);
	const [currentLatitude, setCurrentLatitude] = useState<number | undefined | null>(undefined);
	const [currentLongitude, setCurrentLongitude] = useState<number | undefined | null>(undefined);
	const { response: stores, loading: getStoresLoading, message, getStores } = useGetStores();
	const { response: allergens, getAllergens, loading: getAllergensLoading } = useGetAllergens();
	const { status, userId, userVerified } = useGetUserData();
	const { sendVerifyMail, response: verifiedResponse, loading: sendVerifyLoading } = useSendVerifyMail();
	const { response: pictures, loading: getPicturesLoading, getPictures } = useGetPictures();
	const { addMessage } = useFloatMessage();
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
			void getStores(params.allergens, params.keywords, params.area, coords, params.radius);
		}
	}, [searchParams, currentLatitude, currentLongitude]);

	useEffect(() => {
		void getAllergens();
	}, []);

	useEffect(() => {
		if (params.allergens !== null) {
			const queryAllergenList = params.allergens.split(",");
			const filterdAllergenList = queryAllergenList.filter((a) => {
				return allergens?.some((b) => a === b.id);
			});
			setSearchAllergens(filterdAllergenList);
		} else {
			setSearchAllergens([]);
		}
	}, [searchParams, allergens]);

	useEffect(() => {
		if (stores !== undefined) {
			void getPictures(stores.map((store) => store.id).join(","));
		}
	}, [stores]);

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
			setCurrentLatitude(null);
			setCurrentLongitude(null);
		}
	}, [searchParams]);

	return (
		<>
			<AddStoreModal
				isOpen={isOpenAddModal && status === "authenticated" && userVerified === true}
				setIsOpen={setIsOpenAddModal}
			/>
			<Modal
				isOpen={isOpenAddModal && status === "authenticated" && userVerified === false}
				setIsOpen={setIsOpenAddModal}
			>
				<SubTitle>お店を追加</SubTitle>
				<p
					className={css`
						text-align: center;
						margin: 30px 0;
					`}
				>
					メニューを追加するには、メール認証を完了する必要があります。
				</p>
				<div
					className={css`
						display: flex;
						justify-content: center;
					`}
				>
					<div>
						{!sendVerifyLoading && verifiedResponse === undefined && userId !== null && (
							<Button
								onClick={() => {
									void sendVerifyMail(userId);
								}}
							>
								認証メールを再送信する
							</Button>
						)}
						{sendVerifyLoading && <Button disabled>送信中</Button>}
						{!sendVerifyLoading && verifiedResponse !== undefined && (
							<Button disabled>認証メールを送信しました</Button>
						)}
					</div>
				</div>
			</Modal>
			<Modal isOpen={isOpenAddModal && status === "unauthenticated"} setIsOpen={setIsOpenAddModal}>
				<SubTitle>お店を追加</SubTitle>
				<p
					className={css`
						text-align: center;
						margin: 30px 0;
					`}
				>
					メニューを追加するには、ログインする必要があります
				</p>
				<div
					className={css`
						display: flex;
						gap: 20px;
						justify-content: center;
					`}
				>
					<div>
						<Button href="/login?redirect=/store">ログイン</Button>
					</div>
					<div>
						<Button href="/register?redirect=/store">アカウント作成</Button>
					</div>
				</div>
			</Modal>
			<div
				className={css`
					display: flex;
					flex-direction: column;
					gap: 20px;
				`}
			>
				{!getStoresLoading && !getAllergensLoading && searchAllergens.length !== 0 && (
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
								allergens?.forEach((allergen) => {
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
				{getStoresLoading && <Loading />}
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
					{message !== undefined && message.type === "error" && <ErrorMessage>{message.text}</ErrorMessage>}
					{!getStoresLoading && stores !== undefined && (
						<>
							{stores.length === 0 && (
								<p
									className={css`
										text-align: center;
									`}
								>
									お店が無いようです😿
								</p>
							)}
							{stores.map((store) => (
								<div
									key={store.id}
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
											{!getPicturesLoading && (
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
														pictures?.find((p) => p.store_id === store.id)?.url ??
														"/no-image.png"
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
							))}
						</>
					)}
				</section>
				{status !== "loading" && (
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
							selected={isOpenAddModal}
						>
							お店を追加
						</Button>
					</div>
				)}
			</div>
		</>
	);
}
