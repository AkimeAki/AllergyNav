export const safeNumber = (value: any): number | null => {
	if (!isNaN(parseInt(value ?? ""))) {
		return Number(value ?? "");
	}

	return null;
};

export const safeString = (value: any): string | null => {
	if (value === null || value === undefined) {
		return null;
	}

	if (typeof value === "number" && isNaN(value)) {
		return null;
	}

	return String(value ?? "");
};

export const safeBigInt = (value: any): bigint | null => {
	if (value === null || value === undefined) {
		return null;
	}

	if (typeof value === "number" && isNaN(value)) {
		return null;
	}

	return BigInt(value ?? "");
};
