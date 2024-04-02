interface StoreResponse {
	id: number;
	name: string;
	address: string;
	description: string;
	updated_at: Date;
	created_at: Date;
	created_user_id: number;
	updated_user_id: number;
}

export type GetStoresResponse = StoreResponse[] | null;
export type GetStoreResponse = StoreResponse | null;
export type AddStoreResponse = StoreResponse | null;
export type EditStoreResponse = StoreResponse | null;

interface MenuResponse {
	id: number;
	name: string;
	store_id: number;
	description: string;
	updated_at: Date;
	created_at: Date;
	created_user_id: number;
	updated_user_id: number;
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
	id: number;
	title: string;
	content: string;
	user_id: number;
	updated_at: Date;
	created_at: Date;
}

export type GetCommentsResponse = CommentResponse[] | null;
export type AddCommentResponse = CommentResponse | null;

interface MenuHistoryResponse {
	id: number;
	name: string;
	store_id: number;
	description: string;
	created_at: Date;
	updated_user_id: number;
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
	id: number;
	email: string;
} | null;

export type GetUserResponse = {
	id: number;
	email: string | 403;
	role: string | 403;
} | null;

export interface Message {
	type: "error" | "success";
	text: string;
}
