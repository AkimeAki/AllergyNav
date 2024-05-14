"use client";

import { css } from "@kuma-ui/core";
import GoogleIcon from "@/components/atoms/GoogleIcon";
import TextInput from "@/components/atoms/TextInput";
import Button from "@/components/atoms/Button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AllergenItem from "@/components/atoms/AllergenItem";
import useGetAllergens from "@/hooks/fetch-api/useGetAllergens";
import LoadingCircleCenter from "@/components/atoms/LoadingCircleCenter";

export default function (): JSX.Element {
	const [selectAllergens, setSelectAllergens] = useState<string[]>([]);
	const [keywords, setKeywords] = useState<string>("");
	const router = useRouter();
	const { getAllergensResponse, getAllergens, getAllergensStatus } = useGetAllergens();

	useEffect(() => {
		getAllergens();
	}, []);

	return (
		<div
			className={css`
				display: flex;
				flex-direction: column;
				gap: 50px;
			`}
		>
			<section>
				<div>
					以下の中から
					<span
						className={css`
							font-weight: 900;
							text-decoration: underline;
							color: var(--color-red);
							margin: 0 5px;
							font-size: 20px;
						`}
					>
						食べられない物
					</span>
					にクリックして
					<span
						className={css`
							vertical-align: sub;
						`}
					>
						<GoogleIcon name="skull" size={25} color="var(--color-red)" />
					</span>
					マークを付けてください。
				</div>
				<div>
					<div
						className={css`
							padding: 30px 0;
						`}
					>
						{(getAllergensStatus === "yet" || getAllergensStatus === "loading") && <LoadingCircleCenter />}
						<div
							className={css`
								display: flex;
								flex-wrap: wrap;
								gap: 20px;
								width: 100%;
								justify-content: center;
							`}
						>
							{getAllergensResponse?.map((item) => {
								const selected = selectAllergens.some((selectAllergen) => selectAllergen === item.id);

								return (
									<div
										key={item.id}
										onClick={() => {
											setSelectAllergens((selectAllergens) => {
												if (selected) {
													return [...selectAllergens].filter((selectAllergen) => {
														return selectAllergen !== item.id;
													});
												}

												return [...selectAllergens, item.id];
											});
										}}
										className={css`
											cursor: pointer;
											user-select: none;
										`}
									>
										<AllergenItem
											image={`/icons/${item.id}.png`}
											text={item.name}
											status={selected ? "skull" : "normal"}
										/>
									</div>
								);
							})}
						</div>
					</div>
					<div
						className={css`
							display: grid;
							grid-template-columns: 1fr 100px;
							place-content: center;
							place-items: center;
							gap: 20px;
							align-items: center;

							@media screen and (max-width: 600px) {
								grid-template-columns: 1fr;
							}
						`}
					>
						<TextInput
							placeholder="キーワードを入力してお店を検索"
							enterKeyHint="search"
							value={keywords}
							onChange={(e) => {
								setKeywords(e.target.value);
							}}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									router.push(`/store?keywords=${keywords}&allergens=${selectAllergens.join(",")}`);
								}
							}}
						/>
						<div
							className={css`
								@media screen and (max-width: 600px) {
									display: none;
								}
							`}
						>
							<Button href={`/store?keywords=${keywords}&allergens=${selectAllergens.join(",")}`}>
								検索
							</Button>
						</div>
					</div>
				</div>
			</section>
			<div
				className={css`
					display: flex;
					flex-direction: column;
					gap: 30px;
				`}
			>
				<section>
					<p>
						『アレルギーナビ』は、アレルギーの方々が少しでも多く、食べに行ける飲食店が見つけられるように作ったサービスです。
					</p>
				</section>
				<section>
					<p>
						どこかの飲食店のアレルギー情報を得た方、持っている方はアレルギーナビに情報を追加してくれると助かります。
					</p>
				</section>
				<section>
					<p>
						現在超β版なので、今後どんどん機能追加予定です。欲しい機能の要望ありましたら、メールやTwitterなど連絡が取れる手段であれば何でも良いので連絡ください。
					</p>
					<p>今後追加予定の機能</p>
					<ul
						className={css`
							margin-top: 20px;
						`}
					>
						<li>もっとアレルゲン追加</li>
						<li>ラベル機能</li>
						<li>お気に入り機能</li>
						<li>閲覧履歴機能</li>
					</ul>
				</section>
			</div>
		</div>
	);
}
