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
import SubTitle from "@/components/atoms/SubTitle";
import Loading from "@/components/atoms/Loading";

export default function (): JSX.Element {
	const [tags, setTags] = useState<Allergen[]>([]);
	const { clickAllergenItem } = allergenSelect(tags, setTags);
	const searchParams = useSearchParams();
	const [isLoading, setIsLoading] = useState<boolean>(true);
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

		setIsLoading(false);
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
				<SubTitle>除去するアレルゲン</SubTitle>
				<section
					css={css`
						position: relative;
						display: flex;
						flex-wrap: wrap;
						margin-top: 10px;
						opacity: ${isLoading ? "0.6" : "1"};
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
									width: calc(100% / 4);
									margin-bottom: 20px;
								`}
							>
								<AllergenItem
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
					{isLoading && (
						<div
							css={css`
								position: absolute;
								top: 0;
								left: 0;
								width: 100%;
								height: 100%;
								display: flex;
								justify-content: center;
								align-items: center;
								z-index: 999;
								cursor: wait;
							`}
						>
							<Loading />
						</div>
					)}
				</section>
			</div>
			<div>
				<SubTitle>キーワード</SubTitle>
				<section
					css={css`
						position: relative;
						opacity: ${isLoading ? "0.6" : "1"};
					`}
				>
					<TextInput
						value={keywords}
						onChange={(e) => {
							setKeywords(e.target.value);
						}}
					/>
					{isLoading && (
						<div
							css={css`
								position: absolute;
								top: 0;
								left: 0;
								width: 100%;
								height: 100%;
								display: flex;
								justify-content: center;
								align-items: center;
								z-index: 999;
								cursor: wait;
							`}
						>
							<Loading />
						</div>
					)}
				</section>
			</div>
			<div>
				<ButtonLink href={`/store?keywords=${keywords}&allergen=${tags.join(",")}`}>検索する</ButtonLink>
			</div>
		</aside>
	);
}
