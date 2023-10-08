/** @jsxImportSource @emotion/react */
"use client";

import AllergenItem from "@/components/atoms/AllergenItem";
import Button from "@/components/atoms/Button";
import Label from "@/components/atoms/Label";
import TextInput from "@/components/atoms/TextInput";
import { allergenList } from "@/definition";
import type { Allergen } from "@/definition";
import { allergenSelect } from "@/hooks/allergen-select";
import { messagesSelector } from "@/selector/messages";
import { css } from "@emotion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSetRecoilState } from "recoil";

interface Props {
	id: number;
}

export default function Client({ id }: Props): JSX.Element {
	const [name, setName] = useState<string>("");
	const setMessages = useSetRecoilState(messagesSelector);
	const router = useRouter();
	const [allergens, setAllergens] = useState<Allergen[]>([]);
	const { clickAllergenItem } = allergenSelect(allergens, setAllergens);

	const clickButton = async (): Promise<void> => {
		try {
			const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					name,
					storeId: id,
					allergens: JSON.stringify(allergens)
				})
			});

			if (result.status !== 200) {
				throw new Error();
			}

			setMessages({
				status: "success",
				message: "メニューを登録できました。"
			});
			router.push(`/store/${id}`);
		} catch (e) {
			setMessages({
				status: "error",
				message: "接続エラーが発生しました。"
			});
		}
	};

	return (
		<form
			css={css`
				display: flex;
				flex-direction: column;
				gap: 20px;
			`}
		>
			<div>
				<Label>メニュー名</Label>
				<TextInput
					onChange={(e) => {
						setName(e.target.value);
					}}
				/>
			</div>
			<div>
				<Label>アレルゲン</Label>
				<div
					css={css`
						display: flex;
						align-items: center;
					`}
				>
					以下の中からこのメニューに
					<span
						css={css`
							font-weight: 900;
							text-decoration: underline;
							color: var(--color-red);
							margin: 0 5px;
							font-size: 20px;
						`}
					>
						含まれている
					</span>
					アレルゲンにクリックして
					<div
						css={css`
							color: var(--color-red);
							margin: 0 5px;
							font-size: 25px;
						`}
						className="material-symbols-outlined"
					>
						skull
					</div>
					マークを付けてください。
				</div>
				<div
					css={css`
						display: flex;
						flex-wrap: wrap;
						padding: 20px 0;
					`}
				>
					{Object.keys(allergenList).map((item) => {
						const allergen = item as Allergen;
						const selected = allergens.some((tag) => tag === allergen);

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
									width: calc(100% / 7);
								`}
							/>
						);
					})}
				</div>
			</div>
			<div>
				<Button
					onClick={() => {
						void clickButton();
					}}
				>
					登録する
				</Button>
			</div>
		</form>
	);
}
