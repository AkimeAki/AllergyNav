import type { ConnectionOptions } from "mysql2/promise";

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

const localDbData = {
	host: "db",
	user: "root",
	password: "root",
	database: "dev"
};

export const mysqlConfig: ConnectionOptions | string =
	(process.env.USE_DB_LOCAL === "1" ? localDbData : process.env.DATABASE_URL) ?? "";

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
