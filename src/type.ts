import type { Allergen } from "@/definition";

export interface Message {
	status: "error" | "success";
	message: string;
}

export interface Store {
	id: number;
	name: string;
	address: string;
	group_id: StoreGroup["id"] | null;
	description: string;
	updated_at: string;
	created_at: string;
}

export interface StoreGroup {
	id: number;
	name: string;
	description: string;
	updated_at: string;
	created_at: string;
}

export interface Menu {
	id: number;
	name: string;
	store_id: number | null;
	group_id: number | null;
	updated_at: string;
	created_at: string;
	allergens: Array<{
		id: Allergen;
		name: string;
	}>;
}

export interface Comment {
	id: number;
	title: string;
	content: string;
	store_id: number;
	updated_at: string;
	created_at: string;
}

export interface StoreGroupList {
	id: number | null;
	name: string | null;
}
