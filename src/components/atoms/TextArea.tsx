"use client";

import { css } from "@kuma-ui/core";
import type { ChangeEventHandler } from "react";
import { useEffect, useRef } from "react";
import LoadingCircle from "@/components/atoms/LoadingCircle";

interface Props {
	value?: string;
	loading?: boolean;
	disabled?: boolean;
	onChange?: ChangeEventHandler<HTMLTextAreaElement>;
	autoSize?: boolean;
}

export default function ({
	value = "",
	onChange,
	disabled = false,
	loading = false,
	autoSize = false
}: Props): JSX.Element {
	const element = useRef(null);

	const adjustHeight = (): void => {
		if (element.current !== null && autoSize) {
			const textarea = element.current as HTMLTextAreaElement;

			const resetHeight = new Promise((resolve) => {
				resolve((textarea.style.height = "auto"));
			});
			void resetHeight.then(() => {
				textarea.style.height = textarea.scrollHeight + "px";
			});
		}
	};

	useEffect(() => {
		window.addEventListener("resize", adjustHeight, false);
	}, []);

	useEffect(() => {
		adjustHeight();
	}, [value]);

	return (
		<div
			className={css`
				position: relative;
				width: 100%;
			`}
		>
			<textarea
				ref={element}
				value={value}
				disabled={disabled}
				onChange={onChange}
				onInput={adjustHeight}
				className={[
					css`
						width: 100%;
						height: 80px;
						resize: none;
						border-style: solid;
						border-width: 1px;
						border-color: var(--color-theme);
						padding: 10px 20px;
						border-radius: 5px;
						line-height: 20px;
						font-size: 18px;
						transition-duration: 200ms;
						transition-property: border-color, box-shadow;
						overflow-y: scroll;
						background-color: var(--color-secondary);

						&:focus {
							box-shadow: 0 0 0 1px var(--color-theme);
						}

						&[disabled] {
							background-color: var(--color-hide);
							user-select: none;
							cursor: not-allowed;

							&:focus {
								border-color: var(--color-theme);
							}
						}
					`,
					autoSize
						? css`
								height: auto;
								overflow-y: hidden;
							`
						: ""
				].join(" ")}
			/>
			{loading && (
				<div
					className={css`
						position: absolute;
						top: 50%;
						left: 50%;
						transform: translate(-50%, -50%);
					`}
				>
					<LoadingCircle size={20} />
				</div>
			)}
		</div>
	);
}
