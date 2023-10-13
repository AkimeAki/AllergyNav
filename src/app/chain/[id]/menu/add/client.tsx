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

export default function ({ id }: Props): JSX.Element {
	const [name, setName] = useState<string>("");
	const setMessages = useSetRecoilState(messagesSelector);
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const [allergens, setAllergens] = useState<Allergen[]>([]);
	const { clickAllergenItem } = allergenSelect(allergens, setAllergens);

	const clickButton = async (): Promise<void> => {
		setIsLoading(true);
		try {
			const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					name,
					chainId: id,
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
			router.push(`/chain/${id}`);
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
			onSubmit={(e) => {
				e.preventDefault();
			}}
		>
			<div>
				<Label>メニュー名</Label>
				<TextInput
					onChange={(e) => {
						setName(e.target.value);
					}}
					readonly={isLoading}
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
							<div
								key={allergen}
								css={css`
									display: flex;
									justify-content: center;
									width: calc(100% / 7);
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
				</div>
			</div>
			<div>
				<Button
					onClick={() => {
						if (!isLoading) {
							void clickButton();
						}
					}}
					loading={isLoading}
				>
					{isLoading ? "登録中…" : "登録する"}
				</Button>
			</div>
		</form>
	);
}
