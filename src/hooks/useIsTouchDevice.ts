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

	const mousemoved = (): void => {
		setIsTouch(false);
	};

	useEffect(() => {
		window.addEventListener("touchstart", touched, false);
		window.addEventListener("mousemove", mousemoved, false);

		return () => {
			window.removeEventListener("touchstart", touched);
			window.removeEventListener("mousemove", mousemoved);
		};
	}, []);

	return { isTouch };
}
