"use client";

import type { Store } from "@/type";
import { css } from "@kuma-ui/core";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ErrorMessage from "@/components/atoms/ErrorMessage";
import Loading from "@/components/atoms/Loading";
import Button from "@/components/atoms/Button";
import AddStoreModal from "@/components/organisms/AddStoreModal";

export default function (): JSX.Element {
	const [isOpenAddModal, setIsOpenAddModal] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(true);
	const [errorMessages, setErrorMessages] = useState<string>("");
	const [stores, setStores] = useState<Store[]>([]);
	const searchParams = useSearchParams();
	const params = {
		allergens: searchParams.get("allergens"),
		keywords: searchParams.get("keywords")
	};

	const getStore = async (): Promise<void> => {
		setLoading(true);
		try {
			const queryAllergens = params.allergens ?? "";
			const queryKeywords = params.keywords ?? "";
			const result = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/store?keywords=${queryKeywords}&allergens=${queryAllergens}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json"
					}
				}
			);

			if (result.status !== 200) {
				throw new Error();
			}

			const response = await result.json();
			setStores(response);
		} catch (e) {
			setErrorMessages("接続エラーが発生しました。");
		}
		setLoading(false);
	};

	useEffect(() => {
		void getStore();
	}, [searchParams]);

	return (
		<>
			<AddStoreModal isOpen={isOpenAddModal} setIsOpen={setIsOpenAddModal} />
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
						display: flex;
						flex-direction: column;
						gap: 20px;
					`}
				>
					{errorMessages !== "" ? (
						<ErrorMessage>{errorMessages}</ErrorMessage>
					) : loading ? (
						<Loading />
					) : (
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
										`}
									>
										<Image
											className={css`
												aspect-ratio: 1/1;
												width: 250px;
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
				<div
					className={css`
						position: sticky;
						bottom: 40px;
						text-align: right;
						z-index: 99;
					`}
				>
					<Button
						onClick={() => {
							setIsOpenAddModal(true);
						}}
					>
						お店を追加
					</Button>
				</div>
			</div>
		</>
	);
}
