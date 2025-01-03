import type { DependencyList, RefObject } from "react";
import { useEffect, useRef } from "react";

export default function <T>(onClick: () => void, deps: DependencyList, targetClass?: string): RefObject<T> {
	const element = useRef<T>(null);

	const handelClick = (e: MouseEvent): void => {
		if (element.current !== null && element.current !== undefined) {
			if (e.target === null) {
				return;
			}

			let click = false;

			if (targetClass !== undefined) {
				const targets = document.querySelectorAll<HTMLDivElement>(`.${targetClass}`);
				for (const target of Array.from(targets)) {
					if (
						!target.contains(e.target as HTMLElement) &&
						!(element.current as unknown as HTMLElement).contains(e.target as HTMLElement)
					) {
						click = true;
					}
				}

				if (targets.length === 0) {
					if (!(element.current as unknown as HTMLElement).contains(e.target as HTMLElement)) {
						click = true;
					}
				}
			} else if (!(element.current as unknown as HTMLElement).contains(e.target as HTMLElement)) {
				click = true;
			}

			if (click) {
				onClick();
			}
		}
	};

	useEffect(() => {
		document.addEventListener("mousedown", handelClick);

		return () => {
			document.removeEventListener("mousedown", handelClick);
		};
	}, deps);

	return element;
}
