// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const safeNumber = (value: any): number | null => {
	if (!isNaN(parseInt(value ?? ""))) {
		return Number(value ?? "");
	}

	return null;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const safeString = (value: any): string | null => {
	if (value === null || value === undefined) {
		return null;
	}

	if (typeof value === "number" && isNaN(value)) {
		return null;
	}

	return String(value ?? "");
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const safeBigInt = (value: any): bigint | null => {
	if (value === null || value === undefined) {
		return null;
	}

	if (typeof value === "number" && isNaN(value)) {
		return null;
	}

	return BigInt(value ?? "");
};
