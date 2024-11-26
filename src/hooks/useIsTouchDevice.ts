import { useEffect, useState } from "react";

const isTouchDevice = (): boolean => {
	if (typeof window !== "undefined") {
		return (
			"ontouchstart" in window || navigator.maxTouchPoints > 0 || window.matchMedia("(pointer:coarse)").matches
		);
	} else {
		return false;
	}
};

export default function () {
	const [isTouch, setIsTouch] = useState<boolean>(false);

	const touched = (): void => {
		setIsTouch(true);
	};

	const move = (e: PointerEvent): void => {
		if (e.pointerType === "mouse") {
			setIsTouch(false);
		}

		if (e.pointerType === "touch" || e.pointerType === "pen") {
			setIsTouch(true);
		}
	};

	useEffect(() => {
		setIsTouch(isTouchDevice());

		window.addEventListener("touchstart", touched, false);
		window.addEventListener("pointermove", move, false);

		return () => {
			window.removeEventListener("touchstart", touched);
			window.removeEventListener("pointermove", move);
		};
	}, []);

	return { isTouch };
}
