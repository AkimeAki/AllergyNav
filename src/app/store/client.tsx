/** @jsxImportSource @emotion/react */
"use client";

import type { Store } from "@/type";
import { css } from "@emotion/react";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import Loading from "@/components/atoms/Loading";
import Link from "next/link";
import { messagesSelector } from "@/selector/messages";
import SearchSidebar from "@/components/organisms/SearchSidebar";

export default function () {
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
			<div
				css={css`
					display: grid;
					grid-template-columns: 300px 1fr;
				`}
			>
				<div css={css``}>
					<SearchSidebar />
				</div>
				<div>
					{isLoading ? (
						<Loading scale={0.5} />
					) : (
						<section
							css={css`
								display: flex;
								flex-direction: column;
								gap: 20px;
							`}
						>
							{stores.map((store) => (
								<div
									key={store.id}
									css={css`
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
										css={css`
											display: flex;
										`}
									>
										<img
											css={css`
												aspect-ratio: 1/1;
											`}
											src="https://placehold.jp/30/F5F5F5/ff5757/250x250.png?text=NO%20IMAGE"
											alt="お店の画像"
										/>
										<div
											css={css`
												padding: 10px;
												width: 100%;
											`}
										>
											<h3
												css={css`
													width: 100%;
													font-size: 20px;
												`}
											>
												{store.name}
											</h3>
										</div>
									</div>
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
				</div>
			</div>
		</>
	);
}
