/** @jsxImportSource @emotion/react */
"use client";

import { css } from "@emotion/react";
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";

interface Props {
	value?: string;
	setValue: Dispatch<SetStateAction<string>>;
	disabled?: boolean;
}

const maxLine = 10;

export default function ({ value = "", setValue, disabled = false }: Props): JSX.Element {
	const [line, setLine] = useState<number>(1);

	useEffect(() => {
		let line = (value.match(/\r\n|\n|\r/g) ?? []).length + 1;
		if (line > maxLine) {
			line = maxLine;
		}
		setLine(line);
	}, [value]);

	return (
		<textarea
			value={value}
			disabled={disabled}
			onChange={(e) => {
				setValue(e.target.value);
			}}
			css={css`
				width: 100%;
				height: calc(20px * ${line} + (20px + 4px));
				resize: none;
				border-style: solid;
				border-width: 2px;
				border-color: var(--color-orange);
				margin-top: 10px;
				padding: 10px;
				line-height: 20px;
				font-size: 18px;
				transition-duration: 200ms;
				transition-property: border-color;
				overflow-y: scroll;

				&:focus {
					border-color: var(--color-green);
				}

				&[disabled] {
					background-color: #e4e4e4;
					user-select: none;
					cursor: wait;

					&:focus {
						border-color: var(--color-orange);
					}
				}
			`}
		/>
	);
}
