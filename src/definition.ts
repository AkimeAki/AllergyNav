export const siteTitle = "アレルギーナビ";

export type Allergen = "egg" | "milk" | "wheat" | "shrimp" | "crab" | "soba" | "peanut";

export interface AllergyData {
	name: string;
	image: string;
}

type AllergenList = {
	[key in Allergen]: AllergyData;
};

export const allergenList: AllergenList = {
	egg: {
		name: "卵",
		image: "/icons/egg.png"
	},
	milk: {
		name: "乳製品",
		image: "/icons/milk.png"
	},
	wheat: {
		name: "小麦",
		image: "/icons/wheet.png"
	},
	shrimp: {
		name: "エビ",
		image: "/icons/shurimp.png"
	},
	crab: {
		name: "カニ",
		image: "/icons/crab.png"
	},
	soba: {
		name: "そば",
		image: "/icons/soba.png"
	},
	peanut: {
		name: "落花生",
		image: "/icons/peanut.png"
	}
};

const DB_LOCAL =
	process.env.DATABASE_URL === undefined
		? true
		: process.env.DB_LOCAL === undefined
		? true
		: Boolean(isNaN(parseInt(process.env.DB_LOCAL)) ? true : parseInt(process.env.DB_LOCAL));

const localDbData = {
	host: "db",
	user: "root",
	password: "root",
	database: "dev"
};

export const mysqlConfig = DB_LOCAL ? localDbData : process.env.DATABASE_URL ?? localDbData;

export class NotFoundError extends Error {
	constructor(message?: string) {
		super(message);
		this.name = "NotFoundError";
	}
}

export class ValidationError extends Error {
	constructor(message?: string) {
		super(message);
		this.name = "ValidationError";
	}
}

export const headerHeight = 70;
export const viewSidebarWidth = 753;
