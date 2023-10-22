/** @jsxImportSource @emotion/react */
"use client";

import type { Chain, Menu, Store } from "@/type";
import { css } from "@emotion/react";
import { allergenList } from "@/definition";
import ButtonLink from "@/components/atoms/ButtonLink";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { messagesSelector } from "@/selector/messages";
import Loading from "@/components/atoms/Loading";
import AllergenItem from "@/components/atoms/AllergenItem";

interface Props {
	id: Store["id"];
}

export default function ({ id }: Props): JSX.Element {
	const setMessages = useSetRecoilState(messagesSelector);
	const [chainName, setChainName] = useState<Chain["name"] | null>(null);
	const [loading, setLoading] = useState(true);
	const [menu, setMenu] = useState<Menu[]>([]);

	useEffect(() => {
		const getStore = async (): Promise<void> => {
			try {
				const menuResult = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu?store=${id}`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json"
					}
				});

				const storeResult = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store/${id}`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json"
					}
				});

				if (menuResult.status !== 200 || storeResult.status !== 200) {
					throw new Error();
				}

				const menuResponse = await menuResult.json();
				const storeResponse = await storeResult.json();

				const chainId = storeResponse.chain_id;
				if (chainId !== null) {
					setChainName(storeResponse.chain_name);
					const chainMenuResult = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu?chain=${chainId}`, {
						method: "GET",
						headers: {
							"Content-Type": "application/json"
						}
					});

					const chainMenuResponse = await chainMenuResult.json();

					setMenu([...menuResponse, ...chainMenuResponse]);
				} else {
					setMenu(menuResponse);
				}

				setLoading(false);
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
			{loading ? (
				<Loading />
			) : (
				<div>
					<div
						css={css`
							margin-bottom: 20px;
						`}
					>
						<ButtonLink href={`/store/${id}/menu/add`}>メニューを追加する</ButtonLink>
					</div>
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
									{item.allergens.length === 0 && <p>無し</p>}
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</>
	);
}
