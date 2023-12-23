"use client";

import { css } from "@kuma-ui/core";
import type { Allergen } from "@/definition";
import { allergenList } from "@/definition";
import type { Dispatch, SetStateAction } from "react";
import AllergenItem from "@/components/atoms/AllergenItem";

interface Props {
	selectAllergens: Allergen[];
	setSelectAllergens: Dispatch<SetStateAction<Allergen[]>>;
}

export default function ({ selectAllergens, setSelectAllergens }: Props): JSX.Element {
	return (
		<div
			className={css`
				display: flex;
				flex-wrap: wrap;
				justify-content: center;
				gap: 20px;
				width: 100%;
			`}
		>
			{Object.keys(allergenList).map((item) => {
				const allergen = item as Allergen;
				const selected = selectAllergens.some((selectAllergen) => selectAllergen === allergen);

				return (
					<div
						key={allergen}
						onClick={() => {
							setSelectAllergens((selectAllergens) => {
								if (selected) {
									return [...selectAllergens].filter((selectAllergen) => {
										return selectAllergen !== allergen;
									});
								}

								return [...selectAllergens, allergen];
							});
						}}
						className={css`
							cursor: pointer;
							user-select: none;
						`}
					>
						<AllergenItem
							image={allergenList[allergen].image}
							text={allergenList[allergen].name}
							selected={selected}
						/>
					</div>
				);
			})}
		</div>
	);
}
