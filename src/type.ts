import type { Allergen } from "@/definition";

export interface Message {
	status: "error" | "success";
	message: string;
}

export interface Store {
	id?: number;
	name?: string;
	chain_id?: number | null;
	url?: string | null;
	deleted?: boolean;
	updated_at?: string;
	created_at?: string;
}

export interface Menu {
	id?: number;
	name?: string;
	store_id?: number;
	chain_id?: number | null;
	deleted?: boolean;
	updated_at?: string;
	created_at?: string;
	allergens?: Array<{
		id: Allergen;
		name: string;
	}>;
}
