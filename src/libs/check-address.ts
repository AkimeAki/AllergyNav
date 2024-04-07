export const includePostCode = (address: string): boolean => {
	if (address.includes("〒")) {
		return true;
	}

	return false;
};
