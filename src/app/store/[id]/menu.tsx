/** @jsxImportSource @emotion/react */
"use client";

import type { Chain, Menu, Store } from "@/type";
import { css } from "@emotion/react";
import AllergenItem from "@/components/atoms/AllergenItem";
import { allergenList } from "@/definition";
import Link from "next/link";
import ButtonLink from "@/components/atoms/ButtonLink";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { messagesSelector } from "@/selector/messages";
import Loading from "@/components/atoms/Loading";

interface Props {
	id: Store["id"];
}

export default function ({ id }: Props): JSX.Element {
	const setMessages = useSetRecoilState(messagesSelector);
	const [chainName, setChainName] = useState<Chain["name"] | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [menu, setMenu] = useState<Menu[]>([]);

	useEffect(() => {
		const getStore = async (): Promise<void> => {
			try {
				const menuResult = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu?storeId=${id}`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json"
					}
				});

				const menuResponse = await menuResult.json();

				const storeResult = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store/${id}`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json"
					}
				});

				const storeResponse = await storeResult.json();
				const chainId = storeResponse.data.chain_id;
				if (chainId !== null) {
					setChainName(storeResponse.data.chain_name);
					const chainMenuResult = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu?chainId=${chainId}`, {
						method: "GET",
						headers: {
							"Content-Type": "application/json"
						}
					});

					const chainMenuResponse = await chainMenuResult.json();

					setMenu([...menuResponse.data, ...chainMenuResponse.data]);
				} else {
					setMenu(menuResponse.data);
				}

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
				<Loading />
			) : (
				<div>
					<ButtonLink
						href={`/store/${id}/menu/add`}
						style={css`
							margin-bottom: 20px;
						`}
					>
						メニューを追加する
					</ButtonLink>
					{chainName !== null && (
						<div
							css={css`
								margin-bottom: 20px;
							`}
						>
							チェーン店「{chainName}」の共通メニューも表示されています。
						</div>
					)}
					<div
						css={css`
							display: flex;
							flex-direction: column;
							gap: 20px;
						`}
					>
						{menu.map((item) => (
							<div
								key={item.id}
								css={css`
									position: relative;
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
								<h3
									css={css`
										font-size: 20px;
									`}
								>
									{item.name}
								</h3>
								<h4
									css={css`
										font-size: 16px;
									`}
								>
									含まれるアレルゲン
								</h4>
								<div
									css={css`
										display: flex;
										gap: 10px;
									`}
								>
									{item.allergens?.map((allergen, index) => {
										if (allergen.id !== null) {
											return (
												<AllergenItem
													key={allergen.id}
													image={allergenList[allergen.id].image}
													text={allergenList[allergen.id].name}
												/>
											);
										}

										return <div key={index}>なし</div>;
									})}
								</div>
								<Link
									href={`/menu/${item.id}`}
									css={css`
										position: absolute;
										top: -2px;
										left: -2px;
										width: calc(100% + 4px);
										height: calc(100% + 4px);
										border-radius: inherit;
									`}
								/>
							</div>
						))}
					</div>
				</div>
			)}
		</>
	);
}
