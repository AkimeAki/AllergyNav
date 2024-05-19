import bcrypt from "bcryptjs";
const saltRounds = 12; // ハッシュ値の計算を遅くするためのパラメータらしい

export const hashPass = async (password: string): Promise<string> => {
	const salt = await bcrypt.genSalt(saltRounds);
	const hashed = await bcrypt.hash(password, salt);
	return hashed;
};

export const verifyPass = async (passA: string, passB: string): Promise<boolean> => {
	const check = await bcrypt.compare(passA, passB);
	return check;
};
