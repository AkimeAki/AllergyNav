/** @jsxImportSource @emotion/react */
"use client";

import { css } from "@emotion/react";
import { useState } from "react";
import type { Allergen } from "@/definition";
import ButtonLink from "@/components/atoms/ButtonLink";
import AllergenButton from "@/components/molecules/AllergenButton";
import { allergenList } from "@/definition";
import { allergenSelect } from "@/hooks/allergen-select";
import GoogleIcon from "@/components/atoms/GoogleIcon";
import Main from "@/layouts/Main";

export default function (): JSX.Element {
	const [keywords, setKeywords] = useState<string>("");
	const [tags, setTags] = useState<Allergen[]>([]);
	const { clickAllergenItem } = allergenSelect(tags, setTags);

	return (
		<Main>
			<div
				css={css`
					display: flex;
					flex-direction: column;
					gap: 50px;
				`}
			>
				<section>
					<div>
						以下の中から
						<span
							css={css`
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
							css={css`
								vertical-align: sub;
							`}
						>
							<GoogleIcon name="skull" size={25} color="var(--color-red)" />
						</span>
						マークを付けてください。
					</div>
					<aside
						css={css`
							display: flex;
							flex-wrap: wrap;
							justify-content: center;
							gap: 10px;
							padding: 30px 0;
							width: 100%;
						`}
					>
						{Object.keys(allergenList).map((item) => {
							const allergen = item as Allergen;
							const selected = tags.some((tag) => tag === allergen);

							return (
								<div
									key={allergen}
									css={css`
										display: flex;
										justify-content: center;
										width: 80px;
									`}
								>
									<AllergenButton
										image={allergenList[allergen].image}
										text={allergenList[allergen].name}
										onClick={() => {
											clickAllergenItem(allergen, selected);
										}}
										selected={selected}
									/>
								</div>
							);
						})}
					</aside>
					<div
						css={css`
							display: grid;
							grid-template-columns: 1fr 100px;
							place-content: center;
							place-items: center;
							gap: 20px;
							align-items: center;
						`}
					>
						<input
							type="text"
							placeholder="キーワードを入力（寿司, 焼肉...）"
							value={keywords}
							onChange={(e) => {
								setKeywords(e.target.value);
							}}
							css={css`
								display: block;
								width: 100%;
								padding: 10px 20px;
								border-style: solid;
								border-color: var(--color-orange);
								border-width: 2px;
								border-radius: 30px;
							`}
						/>
						<ButtonLink href={`/store?keywords=${keywords}&allergen=${tags.join(",")}`}>検索</ButtonLink>
					</div>
				</section>
				<section>
					<p>
						『アレルギーナビ』は、アレルギーの方々が少しでも多く、食べに行ける飲食店が見つけられるように作ったサービスです。
					</p>
				</section>
				<section>
					<p>
						もし、アレルギーの方がどこかの飲食店に訪れて食べる、どこかの飲食店に問い合わせてアレルギー成分表をもらう等、飲食店のアレルギー情報を得た方はアレルギーナビに情報を追加してくれると助かります。
					</p>
					<p>
						ちなみに、このサービスの作者も乳と卵のアレルギーです。（乳と卵のアレルギ情報待ってます...なんて言ってみたり）
					</p>
				</section>
				<section>
					<p>
						現在超β版なので、今後どんどん機能追加予定です。欲しい機能の要望ありましたら、メールやTwitterなど連絡が取れる手段であれば何でも良いので連絡ください。
					</p>
					<p>今後追加予定の機能</p>
					<ul
						css={css`
							margin-top: 20px;
						`}
					>
						<li>もっとアレルゲン追加</li>
						<li>アレルギーのオプション追加（熱を通してたらOK等）</li>
						<li>料理の画像アップロード</li>
						<li>アカウント機能</li>
					</ul>
				</section>
			</div>
		</Main>
	);
}
