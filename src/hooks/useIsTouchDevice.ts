import { useEffect, useState } from "react";

const isTouchDevice = (): boolean => {
	return "ontouchstart" in window || navigator.maxTouchPoints > 0 || window.matchMedia("(pointer:coarse)").matches;
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function () {
	const [isTouch, setIsTouch] = useState<boolean>(isTouchDevice());

	const touched = (): void => {
		setIsTouch(true);
	};

	const move = (e: PointerEvent): void => {
		if (e.pointerType === "mouse") {
			setIsTouch(false);
		}

		if (e.pointerType === "touch") {
			setIsTouch(true);
		}
	};

	useEffect(() => {
		window.addEventListener("touchstart", touched, false);
		window.addEventListener("pointermove", move, false);

		return () => {
			window.removeEventListener("touchstart", touched);
			window.removeEventListener("pointermove", move);
		};
	}, []);

	return { isTouch };
}
