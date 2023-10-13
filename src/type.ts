import type { Allergen } from "@/definition";

export interface Message {
	status: "error" | "success";
	message: string;
}

export interface Store {
	id: number;
	name: string;
	address: string;
	chain_id: Chain["id"] | null;
	chain_name: Chain["name"] | null;
	description: string;
	updated_at: string;
	created_at: string;
}

export interface Chain {
	id: number;
	name: string;
	description: string;
	updated_at: string;
	created_at: string;
}

export interface Menu {
	id: number;
	name: string;
	store_id: number;
	chain_id: number | null;
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

export interface ChainList {
	id: Store["chain_id"];
	name: Store["chain_name"];
}
