/** @jsxImportSource @emotion/react */
"use client";

import type { Store } from "@/type";
import { css } from "@emotion/react";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import Loading from "@/components/atoms/Loading";
import Link from "next/link";
import { messagesSelector } from "@/selector/messages";
import Image from "next/image";

export default function (): JSX.Element {
	const [isLoading, setIsLoading] = useState(true);
	const [stores, setStores] = useState<Store[]>([]);
	const setMessages = useSetRecoilState(messagesSelector);

	useEffect(() => {
		const getStore = async (): Promise<void> => {
			try {
				const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json"
					}
				});

				const response = await result.json();
				const data = response.data;
				setStores(data);
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
				<section
					css={css`
						display: grid;
						grid-template-columns: repeat(4, 1fr);
						gap: 20px;
						padding: 20px;
					`}
				>
					{stores.map((store) => (
						<div
							key={store.id}
							css={css`
								position: relative;
								transition-duration: 400ms;
								transition-property: box-shadow;
								overflow: hidden;

								&:hover > img {
									transform: scale(1.2);
								}
							`}
						>
							<Image
								css={css`
									aspect-ratio: 1/1;
									width: 100%;
									transition-duration: 200ms;
									transition-property: transform;
								`}
								src="https://placehold.jp/30/F5F5F5/ff5757/250x250.png?text=NO%20IMAGE"
								alt="お店の画像"
							/>
							<h3
								css={css`
									position: absolute;
									bottom: 0;
									left: 0;
									width: 100%;
									color: white;
									font-size: 17px;
									z-index: 50;
									padding: 10px;
								`}
							>
								{store.name}
							</h3>
							<div
								css={css`
									position: absolute;
									bottom: 0;
									left: 0;
									width: 100%;
									height: 40%;
									background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0));
									z-index: 25;
									transition-duration: 200ms;
									transition-property: background-image;

									&:hover {
										background-image: linear-gradient(
											0deg,
											rgb(236, 109, 78, 0.4),
											rgba(0, 0, 0, 0)
										);
									}
								`}
							></div>
							<Link
								css={css`
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
				</section>
			)}
		</>
	);
}
