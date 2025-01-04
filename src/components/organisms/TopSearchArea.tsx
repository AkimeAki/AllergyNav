"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { css } from "@kuma-ui/core";
import SmallModal from "@/components/molecules/SmallModal";
import useGetAllergens from "@/hooks/fetch-api/useGetAllergens";
import AllergenItem from "@/components/atoms/AllergenItem";
import LoadingCircleCenter from "../atoms/LoadingCircleCenter";

export default function (): JSX.Element {
	const [selectAllergens, setSelectAllergens] = useState<string[]>([]);
	const [keywords, setKeywords] = useState<string>("");
	const [area, setArea] = useState<string>("全エリア");
	const router = useRouter();
	const [isOpenSelectAllergensModal, setIsOpenSelectAllergensModal] = useState<boolean>(false);
	const [isOpenSelectAreaModal, setIsOpenSelectAreaModal] = useState<boolean>(false);
	const selectAllergensButton = useRef<HTMLDivElement | null>(null);
	const selectAreaButton = useRef<HTMLDivElement | null>(null);
	const { getAllergensResponse, getAllergens, getAllergensStatus } = useGetAllergens();

	useEffect(() => {
		if (isOpenSelectAllergensModal && getAllergensStatus === "yet") {
			getAllergens();
		}
	}, [isOpenSelectAllergensModal, getAllergensStatus]);

	return (
		<div
			className={css`
				width: 100%;
				container-type: inline-size;
				display: flex;
				justify-content: center;
			`}
		>
			<div
				className={css`
					display: grid;
					grid-template-columns: 1fr 60px;
					max-width: 690px;
					width: 100%;

					@container (max-width: 629px) {
						width: 100%;
						grid-template-columns: 1fr;
						gap: 10px;
					}
				`}
			>
				<div
					className={css`
						display: grid;
						grid-template-columns: 1fr 1fr 1fr;
						--border-color: #a7a7a7;
						--border-radius: 4px;

						& > input,
						& > div {
							border: 1px solid var(--border-color);
							font-size: 14px;
							padding: 7px 15px;
							height: 40px;
							background-color: var(--color-secondary);
							color: var(--color-primary);
							align-content: center;
							border-right: none;
						}

						& > div {
							cursor: pointer;
						}

						& > input:focus,
						& > div.focus {
							position: relative;
							outline: 2px solid var(--color-theme);
							outline-offset: -1px;
						}

						@container (max-width: 629px) {
							grid-template-columns: 1fr 1fr;
						}

						@container (max-width: 550px) {
							grid-template-columns: 1fr;
						}
					`}
				>
					<div
						placeholder="エリア"
						onClick={() => {
							if (!isOpenSelectAreaModal) {
								setIsOpenSelectAreaModal(true);
							}
						}}
						ref={selectAreaButton}
						className={css`
							border-top-left-radius: var(--border-radius);
							border-bottom-left-radius: var(--border-radius);

							@container (max-width: 629px) {
								border-radius: 0;
								border-top-left-radius: var(--border-radius);
								border-bottom: none !important;
								width: auto;
								grid-area: 1 / 1 / 2 / 2;
							}

							@container (max-width: 550px) {
								border-top-right-radius: var(--border-radius);
								border-right: 1px solid var(--border-color) !important;
								grid-area: auto;
							}
						`}
					>
						{area}
					</div>
					<input
						placeholder="店名、ジャンルなど"
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
						className={css`
							@container (max-width: 629px) {
								width: auto;
								border-bottom: none !important;
								border-right: 1px solid var(--border-color) !important;
								border-top-right-radius: var(--border-radius);
								grid-area: 1 / 2 / 2 / 3;
							}

							@container (max-width: 550px) {
								border-radius: 0;
								grid-area: auto;
							}
						`}
					/>
					<div
						onClick={() => {
							if (!isOpenSelectAllergensModal) {
								setIsOpenSelectAllergensModal(true);
							}
						}}
						ref={selectAllergensButton}
						className={[
							css`
								@container (max-width: 629px) {
									width: auto;
									border-bottom-left-radius: var(--border-radius);
									border-bottom-right-radius: var(--border-radius);
									border-right: 1px solid var(--border-color) !important;
									grid-area: 2 / 1 / 3 / 3;
								}

								@container (max-width: 550px) {
									grid-area: auto;
								}
							`,
							isOpenSelectAllergensModal ? "focus" : ""
						].join(" ")}
					>
						{selectAllergens.length === 0 && "アレルギー"}
						{selectAllergens.length !== 0 && (
							<>
								{(getAllergensResponse ?? [])
									.filter((allergen) => {
										return selectAllergens.includes(allergen.id);
									})
									.map((allergen) => allergen.name)
									.join(", ")}
							</>
						)}
					</div>
				</div>
				<a
					href={`/store?keywords=${keywords}&allergens=${selectAllergens.join(",")}&area=${area === "現在地周辺" ? "location&radius=2.5" : "all"}`}
					className={css`
						background-color: var(--color-theme);
						border: 1px solid var(--color-theme);
						border-top-right-radius: 4px;
						border-bottom-right-radius: 4px;
						color: var(--color-secondary);
						white-space: nowrap;
						align-content: center;
						padding: 0 10px;
						font-size: 14px;
						font-weight: bold;
						text-align: center;

						@container (max-width: 629px) {
							padding: 10px;
							border-radius: 4px;
						}
					`}
				>
					検索
				</a>
			</div>
			<SmallModal
				isOpen={isOpenSelectAllergensModal}
				setIsOpen={setIsOpenSelectAllergensModal}
				targetElement={selectAllergensButton.current}
				title="アレルギーを選択"
			>
				{getAllergensStatus === "loading" && <LoadingCircleCenter />}
				<div
					className={css`
						display: grid;
						grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
						gap: 5px;
					`}
				>
					{(getAllergensResponse ?? []).map((allergen) => (
						<div
							key={allergen.id}
							onClick={() => {
								setSelectAllergens((selectAllergens) => {
									if (selectAllergens.includes(allergen.id)) {
										return [...selectAllergens].filter((selectAllergen) => {
											return selectAllergen !== allergen.id;
										});
									} else {
										return [...selectAllergens, allergen.id];
									}
								});
							}}
							className={[
								css`
									display: flex;
									justify-content: center;
									cursor: pointer;
									border-radius: 4px;
									border: 1px solid var(--color-primary);
									padding: 3px;
								`,
								selectAllergens.includes(allergen.id)
									? css`
											outline: 2px solid var(--color-theme);
											outline-offset: -1px;
										`
									: ""
							].join(" ")}
						>
							<AllergenItem image={`/icons/${allergen.id}.png`} text={allergen.name} />
						</div>
					))}
				</div>
			</SmallModal>
			<SmallModal
				isOpen={isOpenSelectAreaModal}
				setIsOpen={setIsOpenSelectAreaModal}
				targetElement={selectAreaButton.current}
				title="エリアを選択"
			>
				<div
					className={css`
						display: grid;
						grid-template-columns: 1fr;
						gap: 5px;

						& > div {
							cursor: pointer;
							padding: 13px 10px;
							font-size: 15px;

							&:hover {
								background-color: var(--color-theme-thin);
							}
						}
					`}
				>
					<div
						onClick={() => {
							setArea("全エリア");
							setIsOpenSelectAreaModal(false);
						}}
					>
						全エリア
					</div>
					<div
						onClick={() => {
							setArea("現在地周辺");
							setIsOpenSelectAreaModal(false);
						}}
					>
						現在地周辺
					</div>
				</div>
			</SmallModal>
		</div>
	);
}
