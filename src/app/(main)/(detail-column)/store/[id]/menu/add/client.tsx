/** @jsxImportSource @emotion/react */
"use client";

import AllergenButton from "@/components/molecules/AllergenButton";
import Button from "@/components/atoms/Button";
import GoogleIcon from "@/components/atoms/GoogleIcon";
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
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const [allergens, setAllergens] = useState<Allergen[]>([]);
	const { clickAllergenItem } = allergenSelect(allergens, setAllergens);

	const clickButton = async (): Promise<void> => {
		setLoading(true);
		try {
			const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					name,
					store: id,
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
					disabled={loading}
				/>
			</div>
			<div>
				<Label>アレルゲン</Label>
				<div>
					以下の中から
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
					<span
						css={css`
							vertical-align: sub;
						`}
					>
						<GoogleIcon name="skull" size={25} color="var(--color-red)" />
					</span>
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
									flex-wrap: wrap;
									width: 80px;
								`}
							>
								<AllergenButton
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
						if (!loading) {
							void clickButton();
						}
					}}
					loading={loading}
				>
					{loading ? "登録中…" : "登録する"}
				</Button>
			</div>
		</form>
	);
}
