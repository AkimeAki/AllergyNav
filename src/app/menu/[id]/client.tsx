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
import Link from "next/link";

interface Props {
	id: number;
}

export default function ({ id }: Props): JSX.Element {
	const [isLoading, setIsLoading] = useState(true);
	const [store, setStore] = useState<Store>({
		id: NaN,
		name: "",
		address: "",
		chain_id: null,
		description: "",
		updated_at: "",
		created_at: ""
	});
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

				storeResponse.data.description = storeResponse.data.description.replace(/\r\n|\n|\r/g, "<br />");
				storeResponse.data.description = storeResponse.data.description.replace(
					/http[^\s|\r\n|\n|\r]*(\s|\r\n|\n|\r|$)/g,
					(match: string) => {
						return `<a href="${match.trim()}" target="_blank">${match.trim()}</a> `;
					}
				);

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
				<div
					css={css`
						display: flex;
						flex-direction: column;
						gap: 30px;
					`}
				>
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
									font-size: 25px;
									font-weight: 600;
								`}
							>
								{store.name}
							</h2>
							<ButtonLink href={`/store/${store.id}/edit`}>編集する</ButtonLink>
						</div>
						<div>
							<table>
								<tr>
									<th>住所: </th>
									<td>{store.address}</td>
								</tr>
							</table>
						</div>
						<div
							dangerouslySetInnerHTML={{
								__html: store.description
							}}
						/>
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
					</section>
				</div>
			)}
		</>
	);
}
