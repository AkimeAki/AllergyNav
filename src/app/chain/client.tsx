/** @jsxImportSource @emotion/react */
"use client";

import type { Chain } from "@/type";
import { css } from "@emotion/react";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import Loading from "@/components/atoms/Loading";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { messagesSelector } from "@/selector/messages";
import SearchSidebar from "@/components/organisms/SearchSidebar";
import Image from "next/image";
import SubTitle from "@/components/atoms/SubTitle";
import GoogleIcon from "@/components/atoms/GoogleIcon";
import { viewSidebarWidth } from "@/definition";

export default function (): JSX.Element {
	const [loading, setLoading] = useState(true);
	const [chains, setChains] = useState<Chain[]>([]);
	const setMessages = useSetRecoilState(messagesSelector);
	const searchParams = useSearchParams();
	const params = {
		allergens: searchParams.get("allergens"),
		keywords: searchParams.get("keywords")
	};

	useEffect(() => {
		const getStore = async (): Promise<void> => {
			try {
				const queryAllergens = params.allergens ?? "";
				const queryKeywords = params.keywords ?? "";
				const result = await fetch(
					`${process.env.NEXT_PUBLIC_API_URL}/chain?keywords=${queryKeywords}&allergens=${queryAllergens}`,
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
				setChains(response);
				setLoading(false);
			} catch (e) {
				setMessages({
					status: "error",
					message: "接続エラーが発生しました。"
				});
			}
		};

		setLoading(true);
		void getStore();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchParams]);

	return (
		<div
			css={css`
				display: grid;
				grid-template-columns: 300px 1fr;
				gap: 10px;

				@media (max-width: 960px) {
					grid-template-columns: 220px 1fr;
				}

				@media (max-width: 800px) {
					display: block;
					margin-top: 60px;
				}
			`}
		>
			<Link
				href="/chain/add"
				css={css`
					display: none;
					position: fixed;
					bottom: 80px;
					right: 20px;
					background-color: var(--color-orange);
					border-radius: 50%;
					width: 55px;
					height: 55px;
					justify-content: center;
					align-items: center;
					box-shadow: 0px 0px 13px -7px #000000;
					cursor: pointer;
					user-select: none;
					text-decoration: none;
					z-index: 999;

					@media (max-width: ${viewSidebarWidth}px) {
						display: flex;
					}
				`}
			>
				<div
					css={css`
						transform: translate(2px, 0px);
					`}
				>
					<GoogleIcon name="add_business" color="white" size={30} />
				</div>
			</Link>
			<SearchSidebar />
			<div
				css={css`
					display: flex;
					flex-direction: column;
					gap: 20px;
				`}
			>
				<SubTitle>チェーン店一覧</SubTitle>
				{loading ? (
					<Loading />
				) : (
					<section
						css={css`
							display: flex;
							flex-direction: column;
							gap: 20px;
						`}
					>
						{chains.map((chain) => (
							<div
								key={chain.id}
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
									<Image
										css={css`
											aspect-ratio: 1/1;
											width: 250px;
										`}
										src="/no-image.png"
										width={250}
										height={250}
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
											{chain.name}
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
									href={`/chain/${chain.id}`}
								/>
							</div>
						))}
					</section>
				)}
			</div>
		</div>
	);
}
