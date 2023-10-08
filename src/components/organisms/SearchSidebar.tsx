/** @jsxImportSource @emotion/react */
"use client";

import { allergenList } from "@/definition";
import type { Allergen } from "@/definition";
import { allergenSelect } from "@/hooks/allergen-select";
import { css } from "@emotion/react";
import { useEffect, useState } from "react";
import AllergenItem from "@/components/atoms/AllergenItem";
import { useSearchParams } from "next/navigation";
import TextInput from "@/components/atoms/TextInput";
import ButtonLink from "@/components/atoms/ButtonLink";

export default function SearchSidebar(): JSX.Element {
	const [tags, setTags] = useState<Allergen[]>([]);
	const { clickAllergenItem } = allergenSelect(tags, setTags);
	const searchParams = useSearchParams();
	const params = {
		allergen: searchParams.get("allergen"),
		keywords: searchParams.get("keywords")
	};
	const [keywords, setKeywords] = useState<string>("");

	useEffect(() => {
		if (params.allergen !== null) {
			const queryAllergenList = params.allergen.split(",");
			const filterdAllergenList = queryAllergenList.filter((a) => {
				return Object.keys(allergenList).some((b) => a === b);
			}) as Allergen[];
			setTags(filterdAllergenList);
		}

		if (params.keywords !== null) {
			setKeywords(params.keywords);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<aside
			css={css`
				display: flex;
				flex-direction: column;
				gap: 30px;
			`}
		>
			<div>
				<h3>除去するアレルゲン</h3>
				<section
					css={css`
						display: flex;
						flex-wrap: wrap;
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
								style={css`
									width: calc(100% / 4);
								`}
							/>
						);
					})}
				</section>
			</div>
			<div>
				<h3>キーワード</h3>
				<section>
					<TextInput
						value={keywords}
						onChange={(e) => {
							setKeywords(e.target.value);
						}}
					/>
				</section>
			</div>
			<div>
				<ButtonLink href={`/store?keywords=${keywords}&allergen=${tags.join(",")}`}>検索する</ButtonLink>
			</div>
		</aside>
	);
}
