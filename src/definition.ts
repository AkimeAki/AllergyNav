export const siteTitle = "アレルギーナビ";

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

export class TooManyRequestError extends Error {
	constructor(message?: string) {
		super(message);
		this.name = "TooManyRequestError";
	}
}

export const headerHeight = 70;
export const viewSidebarWidth = 753;
