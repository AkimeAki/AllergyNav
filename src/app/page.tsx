/** @jsxImportSource @emotion/react */
"use client";

import { css } from "@emotion/react";
import { useState } from "react";
import type { Allergen } from "@/definition";
import ButtonLink from "@/components/atoms/ButtonLink";
import AllergenItem from "@/components/atoms/AllergenItem";
import { allergenList } from "@/definition";
import { allergenSelect } from "@/hooks/allergen-select";

export default function (): JSX.Element {
	const [keywords, setKeywords] = useState<string>("");
	const [tags, setTags] = useState<Allergen[]>([]);
	const { clickAllergenItem } = allergenSelect(tags, setTags);

	return (
		<>
			<div
				css={css`
					display: flex;
					align-items: center;
				`}
			>
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
				<div
					css={css`
						color: var(--color-red);
						margin: 0 5px;
						font-size: 25px;
					`}
					className="material-symbols-outlined"
				>
					skull
				</div>
				マークを付けてください。
			</div>
			<aside
				css={css`
					display: grid;
					grid-template-columns: repeat(7, 1fr);
					place-items: center;
					gap: 10px;
					padding: 30px;
					width: 100%;
				`}
			>
				{Object.keys(allergenList).map((item) => {
					const allergen = item as Allergen;
					const selected = tags.some((tag) => tag === allergen);

					return (
						<AllergenItem
							key={allergen}
							image={allergenList[allergen].image}
							text={allergenList[allergen].name}
							onClick={() => {
								clickAllergenItem(allergen, selected);
							}}
							selected={selected}
						/>
					);
				})}
			</aside>
			<div
				css={css`
					display: flex;
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
		</>
	);
}
