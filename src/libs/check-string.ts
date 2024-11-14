export const deleteEmptyString = (text: string): string => {
	let deletedText = text;

	// スペース
	deletedText = deletedText.replaceAll(/\s/g, "");

	// タブ
	deletedText = deletedText.replaceAll(/\t/g, "");

	// 改行
	deletedText = deletedText.replaceAll(/\r|\n|\r\n/g, "");

	return deletedText;
};

export const isEmptyString = (text: string): boolean => {
	return deleteEmptyString(text) === "";
};

export const isEmailString = (text: string): boolean => {
	// @が1つだけある
	if (!/^[^@]+@[^@]+$/.test(text)) {
		return false;
	}

	return true;
};

export const isValidPassword = (password: string): boolean => {
	return password.length <= 60;
};
