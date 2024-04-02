import type { DependencyList, RefObject } from "react";
import { useEffect, useRef } from "react";

export default function <T>(onClick: () => void, deps: DependencyList): RefObject<T> {
	const element = useRef<T>(null);

	const handelClick = (e: MouseEvent): void => {
		if (element.current !== null && element.current !== undefined) {
			if (e.target === null) {
				return;
			}

			if (!(element.current as unknown as HTMLElement).contains(e.target as HTMLElement)) {
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
