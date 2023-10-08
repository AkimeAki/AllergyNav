/** @jsxImportSource @emotion/react */
"use client";

import AllergenItem from "@/components/atoms/AllergenItem";
import type { Allergen } from "@/definition";
import { allergenList } from "@/definition";
import { allergenSelect } from "@/hooks/allergen-select";
import { css } from "@emotion/react";
import type { Dispatch, SetStateAction } from "react";

interface Props {
	tags: Allergen[];
	setTags: Dispatch<SetStateAction<Allergen[]>>;
}

export default function AllergenSelect({ tags, setTags }: Props): JSX.Element {
	const { clickAllergenItem } = allergenSelect(tags, setTags);

	return (
		<aside
			css={css`
				display: grid;
				grid-template-columns: repeat(7, 1fr);
				place-items: center;
				gap: 10px;
				padding: 10px;
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
	);
}
