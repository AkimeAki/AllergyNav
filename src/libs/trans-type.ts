export const safeNumber = (value: any): number | null => {
	return !isNaN(parseInt(value ?? "")) ? parseInt(value ?? "") : null;
};

export const safeString = (value: any): string | null => {
	return value === null || value === undefined
		? null
		: typeof value === "number" && isNaN(value)
		  ? null
		  : String(value ?? "");
};
