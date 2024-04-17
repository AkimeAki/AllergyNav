"use client";

import { css } from "@kuma-ui/core";
import BadAllergenSelect from "@/components/molecules/BadAllergenSelect";
import Button from "@/components/atoms/Button";
import { useState } from "react";
import TextInput from "@/components/atoms/TextInput";

export default function (): JSX.Element {
	const [selectAllergens, setSelectAllergens] = useState<string[]>([]);
	const [keywords, setKeywords] = useState<string>("");

	return (
		<div>
			<div
				className={css`
					padding: 30px 0;
				`}
			>
				<BadAllergenSelect
					selectAllergens={selectAllergens}
					setSelectAllergens={setSelectAllergens}
					position="center"
				/>
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
					value={keywords}
					onChange={(e) => {
						setKeywords(e.target.value);
					}}
				/>
				<div
					className={css`
						@media screen and (max-width: 600px) {
							display: none;
						}
					`}
				>
					<Button href={`/store?keywords=${keywords}&allergens=${selectAllergens.join(",")}`}>検索</Button>
				</div>
			</div>
		</div>
	);
}
