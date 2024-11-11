"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { css } from "@kuma-ui/core";
import GoogleIcon from "@/components/atoms/GoogleIcon";

interface Props {
	children: ReactNode;
}

export default function ({ children }: Props): JSX.Element {
	const element = useRef<HTMLButtonElement | null>(null);

	useEffect(() => {
		const button = element.current;
		if (button === null) {
			return;
		}

		const eventCustom = (event: Event): void => {
			event.preventDefault();
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			button.promptEvent = event;
			button.style.display = "flex"; // 要素を表示する
		};

		const click = (): void => {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			if (button.promptEvent !== null && button.promptEvent !== undefined) {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				button.promptEvent.prompt();

				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				button.promptEvent.userChoice.then(() => {
					button.style.display = "none";

					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-expect-error
					button.promptEvent = null;
				});
			}
		};

		window.addEventListener("beforeinstallprompt", eventCustom);
		button.addEventListener("click", click);

		return () => {
			window.removeEventListener("beforeinstallprompt", eventCustom);
			button.removeEventListener("click", click);
		};
	}, []);

	return (
		<button
			type="button"
			ref={element}
			className={css`
				position: relative;
				display: none;
				align-items: center;
				gap: 10px;
				text-decoration: none;
				cursor: pointer;
				background-color: var(--color-secondary);
				border-style: solid;
				border-color: var(--color-theme);
				color: var(--color-theme);
				border-width: 2px;
				border-radius: 30px;
				font-weight: bold;
				overflow: hidden;
				white-space: nowrap;
				user-select: none;
				text-align: center;
				padding: 12px 30px;
				font-size: 18px;

				* {
					transition-duration: 200ms;
					transition-property: color, border-color, background-color;
					color: var(--color-theme);
				}
			`}
		>
			<div>
				<GoogleIcon name="install_mobile" size={25} color="var(--color-theme)" />
			</div>
			<div>{children}</div>
		</button>
	);
}
