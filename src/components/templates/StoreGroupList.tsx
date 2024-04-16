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
import { SessionProvider, useSession } from "next-auth/react";
import Modal from "@/components/molecules/Modal";
import SubTitle from "@/components/atoms/SubTitle";

const StoreGroupList = (): JSX.Element => {
	const [isOpenAddModal, setIsOpenAddModal] = useState<boolean>(false);
	const searchParams = useSearchParams();
	const { response: stores, loading, message, getStores } = useGetStores();
	const { data: session } = useSession();
	const params = {
		allergens: searchParams.get("allergens") ?? "",
		keywords: searchParams.get("keywords") ?? ""
	};

	useEffect(() => {
		void getStores(params.allergens, params.keywords);
	}, [searchParams]);

	return (
		<>
			{session?.user !== undefined && session?.user !== null && (
				<AddStoreModal isOpen={isOpenAddModal} setIsOpen={setIsOpenAddModal} />
			)}
			{session?.user === undefined && session?.user !== null && (
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
					{loading && <Loading />}
					{message !== undefined && message.type === "error" && <ErrorMessage>{message.text}</ErrorMessage>}
					{!loading && (
						<>
							{stores?.length === 0 && (
								<p
									className={css`
										text-align: center;
									`}
								>
									お店が無いようです😿
								</p>
							)}
							{stores?.map((store) => (
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
											`}
										>
											<h3
												className={css`
													width: 100%;
													font-size: 20px;
												`}
											>
												{store.name}
											</h3>
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
				{session !== undefined && (
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
			<StoreGroupList />
		</SessionProvider>
	);
}
