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

export const checkValidPassword = (
	password: string
): {
	status: "success" | "long" | "not allowed";
	message: string;
} => {
	const allowedString = [
		"#",
		"$",
		"%",
		"&",
		"@",
		"^",
		"`",
		"~",
		".",
		",",
		":",
		";",
		'"',
		"'",
		"\\",
		"/",
		"|",
		"_",
		"-",
		"<",
		">",
		"*",
		"+",
		"!",
		"?",
		"=",
		"{",
		"}",
		"[",
		"]",
		"(",
		")"
	];

	const uppercaseLetterStart = "a".charCodeAt(0);
	[...Array(26)].forEach((_, i) => {
		allowedString.push(String.fromCharCode(uppercaseLetterStart + i));
	});

	const lowercaseLetterStart = "A".charCodeAt(0);
	[...Array(26)].forEach((_, i) => {
		allowedString.push(String.fromCharCode(lowercaseLetterStart + i));
	});

	[...Array(10)].forEach((_, i) => {
		allowedString.push(String(i));
	});

	let deleteAllowedStringPassword = password;
	for (const string of allowedString) {
		deleteAllowedStringPassword = deleteAllowedStringPassword.replaceAll(string, "");
	}

	if (deleteAllowedStringPassword !== "") {
		return {
			status: "not allowed",
			message: deleteAllowedStringPassword
		};
	}

	if (password.length > 60) {
		return {
			status: "long",
			message: ""
		};
	}

	return {
		status: "success",
		message: ""
	};
};
