interface StoreResponse {
	id: string;
	name: string;
	address: string;
	description: string;
	updated_at: Date;
	created_at: Date;
	created_user_id: string;
	updated_user_id: string;
}

export type GetStoresResponse = StoreResponse[] | null;
export type GetStoreResponse = StoreResponse | null;
export type AddStoreResponse = StoreResponse | null;
export type EditStoreResponse = StoreResponse | null;

interface PictureResponse {
	id: string;
	url: string;
	updated_at: Date;
	created_at: Date;
}

export type GetPicturesResponse = PictureResponse[] | null;
export type AddPictureResponse = PictureResponse | null;

interface MenuResponse {
	id: string;
	name: string;
	store_id: string;
	description: string;
	updated_at: Date;
	created_at: Date;
	created_user_id: string;
	updated_user_id: string;
	allergens: Array<{
		id: string;
		name: string;
	}>;
}

export type GetMenuResponse = MenuResponse | null;
export type GetMenusResponse = MenuResponse[] | null;
export type AddMenuResponse = MenuResponse | null;
export type EditMenuResponse = MenuResponse | null;

interface CommentResponse {
	id: string;
	title: string;
	content: string;
	user_id: string;
	updated_at: Date;
	created_at: Date;
}

export type GetCommentsResponse = CommentResponse[] | null;
export type AddCommentResponse = CommentResponse | null;

interface MenuHistoryResponse {
	id: string;
	name: string;
	store_id: string;
	description: string;
	created_at: Date;
	updated_user_id: string;
	allergens: Array<{
		id: string;
		name: string;
	}>;
}

export type GetMenuHistoryResponse = MenuHistoryResponse[] | null;

interface AllergenResponse {
	id: string;
	name: string;
}

export type GetAllergensResponse = AllergenResponse[] | null;

export type AddUserResponse = {
	id: string;
	email: string;
} | null;

export type GetUserResponse = {
	id: string;
	email: string | 403;
	role: string | 403;
	verified: boolean | 403;
} | null;

export interface Message {
	type: "error" | "success";
	text: string;
}
