"use client";

import { css } from "@kuma-ui/core";
import AllergenSelector from "@/components/molecules/AllergenSelector";
import Button from "@/components/atoms/Button";
import { useState } from "react";
import type { Allergen } from "@/definition";

export default function (): JSX.Element {
	const [selectAllergens, setSelectAllergens] = useState<Allergen[]>([]);
	const [keywords, setKeywords] = useState<string>("");

	return (
		<div>
			<div
				className={css`
					padding: 30px 0;
				`}
			>
				<AllergenSelector selectAllergens={selectAllergens} setSelectAllergens={setSelectAllergens} />
			</div>
			<div
				className={css`
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
					placeholder="キーワードを入力"
					value={keywords}
					onChange={(e) => {
						setKeywords(e.target.value);
					}}
					className={css`
						display: block;
						width: 100%;
						padding: 10px 20px;
						border-style: solid;
						border-color: var(--color-orange);
						border-width: 1px;
						border-radius: 9999px;
						transition-duration: 200ms;
						transition-property: box-shadow;

						&:focus {
							box-shadow: 0 0 0 1px var(--color-orange);
						}
					`}
				/>
				<Button href={`/store?keywords=${keywords}&allergen=${selectAllergens.join(",")}`}>検索</Button>
			</div>
		</div>
	);
}
