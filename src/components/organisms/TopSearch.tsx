"use client";

import TextInput from "@/components/atoms/TextInput";
import Button from "@/components/atoms/Button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AllergenItem from "@/components/atoms/AllergenItem";
import { css } from "@kuma-ui/core";
import type { GetAllergensResponse } from "@/type";
import { useFloatMessage } from "@/hooks/useFloatMessage";
import SelectButton from "@/components/atoms/SelectButton";

interface Props {
	allergens: NonNullable<GetAllergensResponse>;
}

export default function ({ allergens }: Props): JSX.Element {
	const [selectAllergens, setSelectAllergens] = useState<string[]>([]);
	const [keywords, setKeywords] = useState<string>("");
	const router = useRouter();
	const [filterMode, setFilterMode] = useState<"exclude" | "include">("exclude");
	const { addMessage } = useFloatMessage();

	return (
		<div
			className={css`
				display: flex;
				flex-direction: column;
				gap: 30px;

				@media (max-width: 880px) {
					margin-top: 30px;
				}
			`}
		>
			<div>
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
								className={[
									css`
										cursor: pointer;
										user-select: none;
										border: 2px solid var(--color-theme);
										padding: 5px;
										border-radius: 7px;
										transition-duration: 200ms;
										transition-property: background-color;
									`,
									selected
										? css`
												background-color: var(--color-theme-thin);
											`
										: ""
								].join(" ")}
							>
								<AllergenItem image={`/icons/${item.id}.png`} text={item.name} />
							</div>
						);
					})}
				</div>
			</div>
			<div
				className={css`
					display: flex;
					gap: 20px;
					justify-content: center;

					@media (max-width: 600px) {
						flex-direction: column;
					}
				`}
			>
				<SelectButton
					onClick={() => {
						setFilterMode("exclude");
					}}
					disabled={filterMode === "exclude"}
				>
					選択したアレルゲンが
					<br />
					<span
						className={css`
							font-weight: bold;
							text-decoration: underline;
							color: var(--color-red);
							font-size: 19px;
							white-space: nowrap;

							@media (max-width: 600px) {
								font-size: 17px;
							}
						`}
					>
						含まれていない
					</span>
					ものを検索
				</SelectButton>
				<SelectButton
					onClick={() => {
						addMessage("未対応です。実装されるまでしばらくお待ち下さい。", "error", 3);
					}}
					disabled={filterMode === "include"}
				>
					選択したアレルゲンが
					<br />
					<span
						className={css`
							font-weight: bold;
							text-decoration: underline;
							color: var(--color-red);
							font-size: 19px;
							white-space: nowrap;

							@media (max-width: 600px) {
								font-size: 17px;
							}
						`}
					>
						含まれている
					</span>
					ものを検索
				</SelectButton>
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
						gap: 10px;
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
							display: flex;
							flex-direction: column;
							width: 100%;
						}
					`}
				>
					<Button href={`/store?keywords=${keywords}&allergens=${selectAllergens.join(",")}`}>検索</Button>
				</div>
			</div>
		</div>
	);
}
