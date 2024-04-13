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
import { SessionProvider } from "next-auth/react";
import Modal from "@/components/molecules/Modal";
import SubTitle from "@/components/atoms/SubTitle";
import useGetAllergens from "@/hooks/useGetAllergens";
import AllergenItem from "@/components/atoms/AllergenItem";
import MiniTitle from "@/components/atoms/MiniTitle";
import useGetUserData from "@/hooks/useGetUserData";

const StoreList = (): JSX.Element => {
	const [isOpenAddModal, setIsOpenAddModal] = useState<boolean>(false);
	const searchParams = useSearchParams();
	const [searchAllergens, setSearchAllergens] = useState<string[]>([]);
	const { response: stores, loading, message, getStore } = useGetStores();
	const { response: allergens, getAllergens, loading: getAllergensLoading } = useGetAllergens();
	const { status } = useGetUserData();
	const params = {
		allergens: searchParams.get("allergens") ?? "",
		keywords: searchParams.get("keywords") ?? ""
	};

	useEffect(() => {
		void getStore(params.allergens, params.keywords);
	}, [searchParams]);

	useEffect(() => {
		void getAllergens();
	}, []);

	useEffect(() => {
		if (params.allergens !== null) {
			const queryAllergenList = params.allergens.split(",");
			const filterdAllergenList = queryAllergenList.filter((a) => {
				return allergens.some((b) => a === b.id);
			});
			setSearchAllergens(filterdAllergenList);
		} else {
			setSearchAllergens([]);
		}
	}, [searchParams, allergens]);

	return (
		<>
			{status === "authenticated" && <AddStoreModal isOpen={isOpenAddModal} setIsOpen={setIsOpenAddModal} />}
			{status === "unauthenticated" && (
				<Modal isOpen={isOpenAddModal} setIsOpen={setIsOpenAddModal}>
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
			)}
			<div
				className={css`
					display: flex;
					flex-direction: column;
					gap: 20px;
					padding: 0 10px;
				`}
			>
				{!loading && !getAllergensLoading && searchAllergens.length !== 0 && (
					<div
						className={css`
							border: 4px solid var(--color-orange);
							padding: 10px;
							background-color: var(--color-orange-thin);
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
								allergens.forEach((allergen) => {
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
								が
								<span
									className={css`
										color: var(--color-red);
										font-weight: bold;
									`}
								>
									含まれていない
								</span>
								メニューを食べられるお店を表示しています。
							</p>
						</div>
					</div>
				)}
				{loading && <Loading />}
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
					{!loading && (
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
										<Image
											className={css`
												aspect-ratio: 1/1;
												width: 250px;

												@media (max-width: 880px) {
													width: 100%;
													height: 250px;
													object-fit: contain;
												}
											`}
											src="/no-image.png"
											width={250}
											height={250}
											alt="お店の画像"
										/>
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
};

export default function (): JSX.Element {
	return (
		<SessionProvider>
			<StoreList />
		</SessionProvider>
	);
}
