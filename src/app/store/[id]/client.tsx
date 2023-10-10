/** @jsxImportSource @emotion/react */
"use client";

import { useEffect, useState } from "react";
import { css } from "@emotion/react";
import type { Store } from "@/type";
import { useSetRecoilState } from "recoil";
import { messagesSelector } from "@/selector/messages";
import Loading from "@/components/atoms/Loading";
import ButtonLink from "@/components/atoms/ButtonLink";
import MenuTab from "./menu";
import MapTab from "./map";
import ImageTab from "./image";
import CommentTab from "./comment";
import Tab from "@/components/atoms/Tab";

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
	const setMessages = useSetRecoilState(messagesSelector);
	const [tab, setTab] = useState<"menu" | "image" | "map" | "comment">("menu");

	useEffect(() => {
		const getStore = async (): Promise<void> => {
			try {
				const storeResult = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store/${id}`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json"
					}
				});

				const storeResponse = await storeResult.json();

				storeResponse.data.description = storeResponse.data.description.replace(/\r\n|\n|\r/g, "<br />");
				storeResponse.data.description = storeResponse.data.description.replace(
					/http[^\s|\r\n|\n|\r]*(\s|\r\n|\n|\r|$)/g,
					(match: string) => {
						return `<a href="${match.trim()}" target="_blank">${match.trim()}</a> `;
					}
				);

				setStore(storeResponse.data);
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
			<div
				css={css`
					display: flex;
					flex-direction: column;
					gap: 30px;
				`}
			>
				{isLoading ? (
					<Loading />
				) : (
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
								<tbody>
									<tr>
										<th>住所: </th>
										<td>{store.address}</td>
									</tr>
								</tbody>
							</table>
						</div>
						<div
							dangerouslySetInnerHTML={{
								__html: store.description
							}}
						/>
					</section>
				)}
				<section>
					<div
						css={css`
							display: flex;
							border-radius: 30px;
							overflow: hidden;
							border-style: solid;
							border-color: var(--color-orange);
							border-width: 2px;
						`}
					>
						<Tab
							selected={tab === "menu"}
							onClick={() => {
								setTab("menu");
							}}
						>
							メニュー
						</Tab>
						<Tab
							selected={tab === "image"}
							onClick={() => {
								setTab("image");
							}}
						>
							画像
						</Tab>
						<Tab
							selected={tab === "map"}
							onClick={() => {
								setTab("map");
							}}
						>
							地図
						</Tab>
						<Tab
							selected={tab === "comment"}
							onClick={() => {
								setTab("comment");
							}}
						>
							コメント
						</Tab>
					</div>
					<div
						css={css`
							padding: 20px 0;
						`}
					>
						{tab === "menu" && <MenuTab id={id} />}
						{tab === "map" && <MapTab address={store.address} />}
						{tab === "image" && <ImageTab />}
						{tab === "comment" && <CommentTab id={id} />}
					</div>
				</section>
			</div>
		</>
	);
}
