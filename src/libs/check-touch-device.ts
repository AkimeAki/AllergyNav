export const isTouchDevice = (): boolean => {
	return "ontouchstart" in window || navigator.maxTouchPoints > 0 || window.matchMedia("(pointer:coarse)").matches;
};
