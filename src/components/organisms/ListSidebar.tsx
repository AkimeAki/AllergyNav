"use client";

import { css } from "@kuma-ui/core";
import SubTitle from "@/components/atoms/SubTitle";
import AllergenSelector from "@/components/molecules/AllergenSelector";
import { allergenList, type Allergen } from "@/definition";
import { useEffect, useState } from "react";
import Button from "@/components/atoms/Button";
import { useSearchParams } from "next/navigation";

export default function (): JSX.Element {
	const [selectAllergens, setSelectAllergens] = useState<Allergen[]>([]);
	const [keywords, setKeywords] = useState<string>("");
	const searchParams = useSearchParams();

	const params = {
		allergens: searchParams.get("allergens"),
		keywords: searchParams.get("keywords")
	};

	useEffect(() => {
		if (params.allergens !== null) {
			const queryAllergenList = params.allergens.split(",");
			const filterdAllergenList = queryAllergenList.filter((a) => {
				return Object.keys(allergenList).some((b) => a === b);
			}) as Allergen[];
			setSelectAllergens(filterdAllergenList);
		} else {
			setSelectAllergens([]);
		}

		setKeywords(params.keywords ?? "");
	}, [searchParams]);

	return (
		<aside
			className={css`
				display: flex;
				flex-direction: column;
				gap: 30px;

				& > div {
					display: flex;
					flex-direction: column;
					gap: 10px;
				}
			`}
		>
			<div>
				<SubTitle>アレルゲンリスト</SubTitle>
				<AllergenSelector selectAllergens={selectAllergens} setSelectAllergens={setSelectAllergens} />
			</div>
			<div>
				<SubTitle>キーワード検索</SubTitle>
				<div
					className={css`
						display: flex;
						align-items: center;
						gap: 5px;

						@media (max-width: 960px) {
							flex-direction: column;
						}
					`}
				>
					<input
						type="text"
						placeholder="キーワードを入力"
						value={keywords}
						onChange={(e) => {
							setKeywords(e.target.value);
						}}
						className={css`
							display: block;
							width: 100%;
							padding: 5px 20px;
							border-style: solid;
							border-color: var(--color-orange);
							border-width: 1px;
							border-radius: 30px;
							transition-duration: 200ms;
							transition-property: box-shadow;
							font-size: 15px;

							&:focus {
								box-shadow: 0 0 0 1px var(--color-orange);
							}
						`}
					/>
					<div
						className={css`
							display: flex;
							align-items: center;
						`}
					>
						<Button
							size="small"
							href={`/store?keywords=${keywords}&allergens=${selectAllergens.join(",")}`}
						>
							検索
						</Button>
					</div>
				</div>
			</div>
		</aside>
	);
}
