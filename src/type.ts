import type { Allergen } from "@/definition";

export interface Store {
	id: number;
	ip: string;
	name: string;
	address: string;
	description: string;
	updated_at: string;
	created_at: string;
}

export interface Menu {
	id: number;
	name: string;
	store_id: number | null;
	updated_at: string;
	created_at: string;
	allergens: Array<{
		id: Allergen;
		name: string;
	}>;
}

export interface Comment {
	id: number;
	ip: string;
	title: string;
	content: string;
	store_id: number;
	updated_at: string;
	created_at: string;
}
