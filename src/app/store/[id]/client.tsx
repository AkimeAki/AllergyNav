/** @jsxImportSource @emotion/react */
"use client";

import { useEffect, useState } from "react";
import { css } from "@emotion/react";
import type { Store, Menu } from "@/type";
import { useSetRecoilState } from "recoil";
import { messagesSelector } from "@/selector/messages";
import Loading from "@/components/atoms/Loading";
import ButtonLink from "@/components/atoms/ButtonLink";
import AllergenItem from "@/components/atoms/AllergenItem";
import { allergenList } from "@/definition";

interface Props {
	id: number;
}

export default function Client({ id }: Props): JSX.Element {
	const [isLoading, setIsLoading] = useState(true);
	const [store, setStore] = useState<Store>({});
	const [menu, setMenu] = useState<Menu[]>([]);
	const setMessages = useSetRecoilState(messagesSelector);

	useEffect(() => {
		const getStore = async (): Promise<void> => {
			try {
				const storeResult = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store/${id}`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json"
					}
				});

				const menuResult = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu?storeId=${id}`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json"
					}
				});

				const storeResponse = await storeResult.json();
				const menuResponse = await menuResult.json();
				setStore(storeResponse.data);
				setMenu(menuResponse.data);
				setIsLoading(false);
			} catch (e) {
				setMessages({
					status: "error",
					message: "接続エラーが発生しました。"
				});
			}
		};

		void getStore();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			{isLoading ? (
				<Loading scale={0.5} />
			) : (
				<>
					<section
						css={css`
							display: flex;
							justify-content: space-between;
							align-items: center;
						`}
					>
						<h2
							css={css`
								font-size: 25px;
								font-weight: 600;
							`}
						>
							{store.name}
						</h2>
						<ButtonLink href={`/store/${store.id}/edit`}>編集する</ButtonLink>
					</section>
					<section>
						<div
							css={css`
								display: flex;
								justify-content: space-between;
								align-items: center;
							`}
						>
							<h2
								css={css`
									font-size: 20px;
								`}
							>
								メニュー
							</h2>
							<ButtonLink href={`/store/${store.id}/menu/add`}>メニューを追加する</ButtonLink>
						</div>
						<div>
							{menu.map((item) => (
								<div
									key={item.id}
									css={css`
										display: flex;
										flex-direction: column;
										gap: 20px;
										transition-duration: 200ms;
										transition-property: box-shadow;
										border-radius: 7px;
										border-width: 2px;
										border-style: solid;
										border-color: #f3f3f3;
										padding: 20px;

										&:hover {
											box-shadow: 0px 0px 15px -10px #777777;
										}
									`}
								>
									<h3>{item.name}</h3>
									<h4>含まれるアレルゲン</h4>

									{item.allergens?.map((allergen, index) => {
										if (allergen.id !== null) {
											return (
												<AllergenItem
													key={allergen.id}
													image={allergenList[allergen.id].image}
													text={allergenList[allergen.id].name}
													style={css`
														cursor: default;

														&:hover > img {
															filter: none;
														}
													`}
												/>
											);
										}

										return <div key={index}>なし</div>;
									})}
								</div>
							))}
						</div>
					</section>
				</>
			)}
		</>
	);
}
