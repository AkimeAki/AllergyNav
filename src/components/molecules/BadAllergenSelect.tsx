"use client";

import { css } from "@kuma-ui/core";
import { useEffect, type Dispatch, type SetStateAction } from "react";
import AllergenItem from "@/components/atoms/AllergenItem";
import GoogleIcon from "@/components/atoms/GoogleIcon";
import useGetAllergens from "@/hooks/fetch-api/useGetAllergens";

interface Props {
	selectAllergens: string[];
	setSelectAllergens: Dispatch<SetStateAction<string[]>>;
	position?: "left" | "right" | "center";
}

export default function ({ selectAllergens, setSelectAllergens, position = "left" }: Props): JSX.Element {
	const { getAllergensResponse, getAllergens } = useGetAllergens();

	useEffect(() => {
		getAllergens();
	}, []);

	return (
		<div
			className={[
				css`
					display: flex;
					flex-wrap: wrap;
					gap: 20px;
					width: 100%;
				`,
				position === "left" &&
					css`
						justify-content: left;
					`,
				position === "right" &&
					css`
						justify-content: right;
					`,
				position === "center" &&
					css`
						justify-content: center;
					`
			].join(" ")}
		>
			{getAllergensResponse?.map((item) => {
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
							selected={selected}
							icon={
								<div
									className={css`
										position: absolute;
										top: 50%;
										left: 50%;
										transform: translate(-50%, -50%);
									`}
								>
									<GoogleIcon name="skull" size={40} color="var(--color-red)" />
								</div>
							}
						/>
					</div>
				);
			})}
		</div>
	);
}
