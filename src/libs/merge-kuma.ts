export const cx = (...style: (string | null | undefined | false)[]) => {
	return style.filter(Boolean).join(" ");
};
