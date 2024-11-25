export const siteTitle = "アレルギーナビ";
export const siteUrl = "https://allergy-navi.com";
export const defaultDescription =
	"『アレルギーナビ』は、アレルギーの方々が少しでも多く、食べに行ける飲食店が見つけられるように作ったサービスです。どこかの飲食店のアレルギー情報を得た方、持っている方はアレルギーナビに情報を追加してくれると助かります。";

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
