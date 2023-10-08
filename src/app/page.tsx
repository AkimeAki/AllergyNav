/** @jsxImportSource @emotion/react */
"use client";

import Button from "@/components/atoms/Button";
import AllergySelect from "@/components/molecules/AllergySelect";
import { css } from "@emotion/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function () {
	const [keywords, setKeywords] = useState<string>("");
	const router = useRouter();

	return (
		<>
			<div
				css={css`
					display: flex;
					align-items: center;
				`}
			>
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
					食べられない物
				</span>
				にクリックして
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
			<AllergySelect />
			<div
				css={css`
					display: flex;
					gap: 20px;
				`}
			>
				<input
					type="text"
					placeholder="キーワードを入力（寿司, 焼肉...）"
					value={keywords}
					onChange={(e) => {
						setKeywords(e.target.value);
					}}
					css={css`
						display: block;
						width: 100%;
						padding: 10px 20px;
						border-style: solid;
						border-color: var(--color-orange);
						border-width: 2px;
						border-radius: 30px;
					`}
				/>
				<Button
					onClick={() => {
						router.push(`/store?keywords=${keywords}&llergen=`);
					}}
				>
					検索
				</Button>
			</div>
		</>
	);
}
