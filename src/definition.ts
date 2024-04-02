export const siteTitle = "アレルギーナビ";

// const localDbData = {
// 	host: "db",
// 	user: "root",
// 	password: "root",
// 	database: "dev"
// };

// export const mysqlConfig: ConnectionOptions | string =
// 	(process.env.USE_DB_LOCAL === "1" ? localDbData : process.env.DATABASE_URL) ?? "";

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

export class ForbiddenError extends Error {
	constructor(message?: string) {
		super(message);
		this.name = "ForbiddenError";
	}
}

export const headerHeight = 70;
export const viewSidebarWidth = 753;
