import mysql from "mysql2/promise";
import type { RowDataPacket } from "mysql2/promise";
import { NotFoundError, ValidationError, mysqlConfig } from "@/definition";
import type { Comment } from "@/type";
import { safeNumber, safeString } from "@/libs/safe-type";

interface CommentRow extends RowDataPacket {
	id: number;
	title: string;
	content: string;
	store_id: number;
	updated_at: string;
	created_at: string;
}

let status = 500;

export const GET = async (req: Request): Promise<Response> => {
	let connection: mysql.Connection | null = null;
	const data: Comment[] = [];

	try {
		connection = await mysql.createConnection(mysqlConfig as string);

		const { searchParams } = new URL(req.url);

		const storeId = safeNumber(searchParams.get("store"));
		const groupId = safeNumber(searchParams.get("group"));

		let storeFilterSql = "";
		if (storeId !== null) {
			storeFilterSql = /* sql */ `WHERE comments.store_id = ${storeId}`;
		}

		let groupFilterSql = "";
		if (groupId !== null) {
			groupFilterSql = /* sql */ `
				INNER JOIN (
					SELECT
						stores.id as id
					FROM stores
					WHERE stores.group_id = ${groupId}
				) as stores ON stores.id = comments.store_id
			`;
		}

		const sql = /* sql */ `
			SELECT
				comments.id as id,
				comments.title as title,
				comments.content as content,
				comments.store_id as store_id,
				comments.updated_at as updated_at,
				comments.created_at as created_at
			FROM (
				SELECT
					id,
					title,
					content,
					store_id,
					updated_at,
					created_at
				FROM comments
				WHERE deleted = FALSE
			) comments
			${storeFilterSql}
			${groupFilterSql}
		`;

		const [rows] = await connection.query<CommentRow[]>(sql);
		rows.forEach((row) => {
			data.push({
				id: row.id,
				title: row.title,
				content: row.content,
				store_id: row.store_id,
				updated_at: row.updated_at,
				created_at: row.created_at
			});
		});

		status = 200;
	} catch (e) {
		data.splice(0);

		if (e instanceof NotFoundError) {
			status = 404;
		} else if (e instanceof ValidationError) {
			status = 422;
		}
	}

	if (connection !== null) {
		await connection.end();
	}

	return new Response(JSON.stringify(data), {
		status
	});
};

export const POST = async (req: Request): Promise<Response> => {
	let connection: mysql.Connection | null = null;
	const data: Comment = {
		id: NaN,
		title: "",
		content: "",
		store_id: NaN,
		updated_at: "",
		created_at: ""
	};

	try {
		connection = await mysql.createConnection(mysqlConfig as string);

		const body = await req.json();

		const title = safeString(body.title);
		const content = safeString(body.content);
		const storeId = safeString(body.store);

		const sql = /* sql */ `
			INSERT INTO comments SET ?
		`;
		const [result] = await connection.query(sql, {
			title,
			content,
			store_id: storeId
		});

		if (!Array.isArray(result)) {
			data.id = result.insertId;
		}

		status = 200;
	} catch (e) {
		if (e instanceof NotFoundError) {
			status = 404;
		} else if (e instanceof ValidationError) {
			status = 422;
		}
	}

	if (connection !== null) {
		await connection.end();
	}

	return new Response(JSON.stringify(data), {
		status
	});
};
