/** @jsxImportSource @emotion/react */
"use client";

import { allergenList, headerHeight } from "@/definition";
import type { Allergen } from "@/definition";
import { allergenSelect } from "@/hooks/allergen-select";
import { css } from "@emotion/react";
import { useEffect, useState } from "react";
import AllergenButton from "@/components/molecules/AllergenButton";
import { usePathname, useSearchParams } from "next/navigation";
import TextInput from "@/components/atoms/TextInput";
import ButtonLink from "@/components/atoms/ButtonLink";
import SubTitle from "@/components/atoms/SubTitle";
import Loading from "@/components/atoms/Loading";
import GoogleIcon from "@/components/atoms/GoogleIcon";

const topSearchHeight = 50;

export default function (): JSX.Element {
	const [tags, setTags] = useState<Allergen[]>([]);
	const { clickAllergenItem } = allergenSelect(tags, setTags);
	const searchParams = useSearchParams();
	const [loading, setLoading] = useState<boolean>(true);
	const params = {
		allergen: searchParams.get("allergen"),
		keywords: searchParams.get("keywords")
	};
	const [keywords, setKeywords] = useState<string>("");
	const pathname = usePathname();
	const [filterOpen, setFilterOpen] = useState<boolean>(false);

	useEffect(() => {
		if (params.allergen !== null) {
			const queryAllergenList = params.allergen.split(",");
			const filterdAllergenList = queryAllergenList.filter((a) => {
				return Object.keys(allergenList).some((b) => a === b);
			}) as Allergen[];
			setTags(filterdAllergenList);
		} else {
			setTags([]);
		}

		setKeywords(params.keywords ?? "");

		setLoading(false);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchParams]);

	return (
		<>
			<div
				css={css`
					display: none;
					position: fixed;
					top: ${headerHeight}px;
					left: 0;
					width: 100%;
					height: ${topSearchHeight}px;
					background-color: ${filterOpen ? "#f0f0f0" : "white"};
					border-bottom-style: solid;
					border-bottom-color: #f0f0f0;
					border-bottom-width: 2px;
					z-index: 99998;
					transition-duration: 300ms;
					transition-property: background-color;

					@media (max-width: 800px) {
						display: block;
					}
				`}
			>
				<div
					css={css`
						display: grid;
						grid-template-columns: 1fr 90px 70px;
						place-content: center;
						place-items: center;
						height: 100%;
						padding-left: 30px;
					`}
				>
					<div
						css={css`
							display: flex;
							align-items: center;
							width: 100%;
							height: 100%;
							padding-right: 20px;
						`}
					>
						<TextInput
							value={keywords}
							onChange={(e) => {
								setKeywords(e.target.value);
							}}
							size="small"
						/>
					</div>
					<ButtonLink
						onClick={() => {
							setFilterOpen(false);
						}}
						href={`${pathname}?keywords=${keywords}&allergens=${tags.join(",")}`}
						size="small"
					>
						検索する
					</ButtonLink>
					<div
						onClick={() => {
							setFilterOpen((status) => {
								return !status;
							});
						}}
						css={css`
							display: flex;
							flex-direction: column;
							justify-content: center;
							align-items: center;
							cursor: pointer;
							user-select: none;
							margin-left: 10px;
						`}
					>
						<GoogleIcon
							name="filter_list"
							size={30}
							color={filterOpen ? "var(--color-red)" : "var(--color-orange)"}
						/>
						<div
							css={css`
								font-size: 13px;
								font-weight: 700;
								white-space: nowrap;
								color: ${filterOpen ? "var(--color-red)" : "inherit"};
							`}
						>
							条件変更
						</div>
					</div>
				</div>
			</div>
			<div
				css={css`
					position: fixed;
					top: ${topSearchHeight + headerHeight}px;
					left: 0;
					width: 100%;
					height: calc(100% - ${topSearchHeight + headerHeight}px);
					background-color: #f0f0f0;
					z-index: 99997;
					padding: 20px;
					transition-duration: 300ms;
					transition-property: transform, opacity;
					overflow-y: scroll;
					transform: translateY(${filterOpen ? 0 : -100}%);
					opacity: ${filterOpen ? 1 : 0};
					user-select: ${filterOpen ? "auto" : "none"};
					pointer-events: ${filterOpen ? "auto" : "none"};
				`}
			>
				<div>
					<SubTitle>除去するアレルゲン</SubTitle>
					<section
						css={css`
							position: relative;
							display: flex;
							flex-wrap: wrap;
							margin-top: 10px;
							opacity: ${loading ? "0.6" : "1"};
						`}
					>
						{Object.keys(allergenList).map((item) => {
							const allergen = item as Allergen;
							const selected = tags.some((tag) => tag === allergen);

							return (
								<div
									key={allergen}
									css={css`
										display: flex;
										justify-content: center;
										width: calc(100% / 4);
										margin-bottom: 20px;
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
					</section>
				</div>
			</div>
			<aside
				css={css`
					display: flex;
					flex-direction: column;
					gap: 30px;

					@media (max-width: 800px) {
						display: none;
					}
				`}
			>
				<div
					css={css`
						display: grid;
						grid-template-columns: 1fr 1fr;
						gap: 5px;

						@media (max-width: 960px) {
							grid-template-columns: 1fr;
						}
					`}
				>
					<ButtonLink href="/store/add" size="small">
						お店を追加
					</ButtonLink>
					<ButtonLink href="/chain/add" size="small">
						チェーン店を追加
					</ButtonLink>
				</div>
				<div>
					<SubTitle>除去するアレルゲン</SubTitle>
					<section
						css={css`
							position: relative;
							display: flex;
							flex-wrap: wrap;
							margin-top: 10px;
							opacity: ${loading ? "0.6" : "1"};
						`}
					>
						{Object.keys(allergenList).map((item) => {
							const allergen = item as Allergen;
							const selected = tags.some((tag) => tag === allergen);

							return (
								<div
									key={allergen}
									css={css`
										display: flex;
										justify-content: center;
										width: calc(100% / 4);
										margin-bottom: 20px;
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
					</section>
				</div>
				<div>
					<SubTitle>キーワード</SubTitle>
					<section
						css={css`
							position: relative;
							opacity: ${loading ? "0.6" : "1"};
						`}
					>
						<TextInput
							value={keywords}
							onChange={(e) => {
								setKeywords(e.target.value);
							}}
						/>
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
					</section>
				</div>
				<div>
					<ButtonLink href={`${pathname}?keywords=${keywords}&allergens=${tags.join(",")}`}>
						検索する
					</ButtonLink>
				</div>
			</aside>
		</>
	);
}
