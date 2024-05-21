"use client";

import GoogleIcon from "@/components/atoms/GoogleIcon";
import TextInput from "@/components/atoms/TextInput";
import Button from "@/components/atoms/Button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AllergenItem from "@/components/atoms/AllergenItem";
import { css } from "@kuma-ui/core";
import type { GetAllergensResponse } from "@/type";

interface Props {
	allergens: NonNullable<GetAllergensResponse>;
}

export default function ({ allergens }: Props): JSX.Element {
	const [selectAllergens, setSelectAllergens] = useState<string[]>([]);
	const [keywords, setKeywords] = useState<string>("");
	const router = useRouter();

	return (
		<div>
			<div>
				以下の中から
				<span
					className={css`
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
					className={css`
						vertical-align: sub;
					`}
				>
					<GoogleIcon name="skull" size={25} color="var(--color-red)" />
				</span>
				マークを付けてください。
			</div>
			<div>
				<div
					className={css`
						padding: 30px 0;
					`}
				>
					<div
						className={css`
							display: flex;
							flex-wrap: wrap;
							gap: 20px;
							width: 100%;
							justify-content: center;
						`}
					>
						{allergens.map((item) => {
							const selected = selectAllergens.some((selectAllergen) => selectAllergen === item.id);

							return (
								<div
									key={item.id}
									onClick={() => {
										setSelectAllergens((selectAllergens) => {
											if (selected) {
												return [...selectAllergens].filter((selectAllergen) => {
													return selectAllergen !== item.id;
												});
											}

											return [...selectAllergens, item.id];
										});
									}}
									className={css`
										cursor: pointer;
										user-select: none;
									`}
								>
									<AllergenItem
										image={`/icons/${item.id}.png`}
										text={item.name}
										status={selected ? "skull" : "normal"}
									/>
								</div>
							);
						})}
					</div>
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
						enterKeyHint="search"
						value={keywords}
						onChange={(e) => {
							setKeywords(e.target.value);
						}}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								router.push(`/store?keywords=${keywords}&allergens=${selectAllergens.join(",")}`);
							}
						}}
					/>
					<div
						className={css`
							@media screen and (max-width: 600px) {
								display: none;
							}
						`}
					>
						<Button href={`/store?keywords=${keywords}&allergens=${selectAllergens.join(",")}`}>
							検索
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
