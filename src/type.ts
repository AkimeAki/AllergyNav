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
