import bcrypt from "bcrypt";
const saltRounds = 12;

export const hashPass = async (password: string): Promise<string> => {
	const salt = await bcrypt.genSalt(saltRounds);
	const hashed = await bcrypt.hash(password, salt);
	return hashed;
};

export const verifyPass = async (passA: string, passB: string): Promise<boolean> => {
	const check = await bcrypt.compare(passA, passB);
	return check;
};
