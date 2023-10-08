/** @jsxImportSource @emotion/react */
"use client";

import { useState, useEffect } from "react";
import AllergenItem from "@/components/atoms/AllergenItem";
import type { Allergen } from "@/definition";
import { allergenList } from "@/definition";
import { css } from "@emotion/react";

export default function AllergySelect() {
	const [tags, setTags] = useState<Allergen[]>([]);

	const clickAllergenItem = (id: Allergen, selected: boolean): void => {
		const currentTags = [...tags];
		if (selected) {
			const index = currentTags.indexOf(id);
			currentTags.splice(index, 1);
			setTags(currentTags);
		} else {
			setTags([...currentTags, id]);
		}
	};

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
