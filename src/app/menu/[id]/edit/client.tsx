/** @jsxImportSource @emotion/react */
"use client";

import AllergenButton from "@/components/molecules/AllergenButton";
import Button from "@/components/atoms/Button";
import GoogleIcon from "@/components/atoms/GoogleIcon";
import Label from "@/components/atoms/Label";
import Loading from "@/components/atoms/Loading";
import TextInput from "@/components/atoms/TextInput";
import type { Allergen } from "@/definition";
import { allergenList } from "@/definition";
import { allergenSelect } from "@/hooks/allergen-select";
import { messagesSelector } from "@/selector/messages";
import type { Menu, Store } from "@/type";
import { css } from "@emotion/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";

interface Props {
	id: number;
}

export default function Client({ id }: Props): JSX.Element {
	const [name, setName] = useState<Store["name"]>("");
	const [allergens, setAllergens] = useState<Allergen[]>([]);
	const [loading, setLoading] = useState(true);
	const [isSendLoading, setIsSendLoading] = useState(false);
	const setMessages = useSetRecoilState(messagesSelector);
	const router = useRouter();
	const { clickAllergenItem } = allergenSelect(allergens, setAllergens);

	useEffect(() => {
		const getStore = async (): Promise<void> => {
			try {
				const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu/${id}`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json"
					}
				});

				if (result.status !== 200) {
					throw new Error();
				}

				const response = await result.json();
				setName(response.name);
				setAllergens((response.allergens as Menu["allergens"]).map((allergen) => allergen.id));
				setLoading(false);
			} catch (e) {
				setMessages({
					status: "error",
					message: "接続エラーが発生しました。"
				});
			}
		};

		void getStore();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const clickButton = async (): Promise<void> => {
		setIsSendLoading(true);
		try {
			const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu/${id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					name,
					allergens: JSON.stringify(allergens)
				})
			});

			if (result.status !== 200) {
				throw new Error();
			}

			setMessages({
				status: "success",
				message: "メニューを編集できました。"
			});
			router.push(`/menu/${id}`);
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
				<Label>名前</Label>
				<TextInput
					value={name}
					onChange={(e) => {
						setName(e.target.value);
					}}
					disabled={loading || isSendLoading}
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
						position: relative;
						display: flex;
						flex-wrap: wrap;
						padding: 20px 0;
						opacity: ${loading ? "0.6" : "1"};
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
					{loading && (
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
				</div>
			</div>
			<div>
				<Button
					onClick={() => {
						if (!(loading || isSendLoading)) {
							void clickButton();
						}
					}}
					loading={loading || isSendLoading}
				>
					{loading ? "読込中…" : isSendLoading ? "更新中…" : "更新する"}
				</Button>
			</div>
		</form>
	);
}
