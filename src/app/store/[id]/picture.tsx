/** @jsxImportSource @emotion/react */
"use client";

import type { Menu } from "@/type";
import { css } from "@emotion/react";
import AllergenItem from "@/components/atoms/AllergenItem";
import { allergenList } from "@/definition";
import Link from "next/link";

interface Props {
	menu: Menu[];
}

export default function ({ menu }: Props): JSX.Element {
	return (
		<>
			<div
				css={css`
					display: flex;
					flex-direction: column;
					gap: 20px;
				`}
			>
				{menu.map((item) => (
					<div
						key={item.id}
						css={css`
							position: relative;
							display: flex;
							flex-direction: column;
							gap: 20px;
							transition-duration: 200ms;
							transition-property: box-shadow;
							border-radius: 7px;
							border-width: 2px;
							border-style: solid;
							border-color: #f3f3f3;
							padding: 20px;

							&:hover {
								box-shadow: 0px 0px 15px -10px #777777;
							}
						`}
					>
						<h3
							css={css`
								font-size: 20px;
							`}
						>
							{item.name}
						</h3>
						<h4
							css={css`
								font-size: 16px;
							`}
						>
							含まれるアレルゲン
						</h4>

						{item.allergens?.map((allergen, index) => {
							if (allergen.id !== null) {
								return (
									<AllergenItem
										key={allergen.id}
										image={allergenList[allergen.id].image}
										text={allergenList[allergen.id].name}
									/>
								);
							}

							return <div key={index}>なし</div>;
						})}

						<Link
							href={`/menu/${item.id}`}
							css={css`
								position: absolute;
								top: -2px;
								left: -2px;
								width: calc(100% + 4px);
								height: calc(100% + 4px);
								border-radius: inherit;
							`}
						/>
					</div>
				))}
			</div>
		</>
	);
}
