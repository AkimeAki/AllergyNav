/** @jsxImportSource @emotion/react */
"use client";

import { css } from "@emotion/react";
import type { SerializedStyles } from "@emotion/react";

interface Props {
	src: string;
	size: string;
	color: string;
	css?: SerializedStyles;
}

export default function ({ src, size, color, css: style = css`` }: Props): JSX.Element {
	return (
		<div
			css={css`
				-webkit-mask-image: url(${src});
				-webkit-mask-size: contain;
				-webkit-mask-repeat: no-repeat;
				-webkit-mask-position-y: 50%;
				mask-image: url(${src});
				mask-size: contain;
				mask-repeat: no-repeat;
				display: inline-block;
				aspect-ratio: 1/1;
				width: ${size};
				background-color: ${color};
				transform: translateY(0.5px);
				${style}
			`}
		/>
	);
}
