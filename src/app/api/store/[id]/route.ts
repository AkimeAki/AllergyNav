import mysql from "mysql2/promise";
import type { RowDataPacket } from "mysql2/promise";
import { mysqlConfig, NotFoundError, ValidationError } from "@/definition";
import type { StoreGroup, Store } from "@/type";
import { safeNumber, safeString } from "@/libs/trans-type";

interface StoreRow extends RowDataPacket {
	id: number;
	name: string;
	address: string;
	store_group_id: StoreGroup["id"] | null;
	group_name: StoreGroup["name"] | null;
	description: string;
	deleted: boolean;
	updated_at: string;
	created_at: string;
}

interface Props {
	params: {
		id: string;
	};
}

const data: Store = {
	id: NaN,
	name: "",
	address: "",
	group_id: null,
	description: "",
	updated_at: "",
	created_at: ""
};

let status = 500;

export const GET = async (_: Request, { params }: Props): Promise<Response> => {
	console.log("aa");
	let connection: mysql.Connection | null = null;

	try {
		connection = await mysql.createConnection(mysqlConfig as string);

		const storeId = safeNumber(params.id);

		if (storeId === null) {
			throw new ValidationError();
		}

		const sql = /* sql */ `
			SELECT
				stores.id as id,
				stores.name as name,
				stores.address as address,
				stores.description as description,
				stores.store_group_id as store_group_id,
				store_groups.name as group_name,
				stores.updated_at as updated_at,
				stores.created_at as created_at
			FROM stores
			LEFT JOIN store_groups ON store_groups.id = stores.store_group_id
			WHERE stores.id = ? AND stores.deleted = FALSE
		`;
		const [rows] = await connection.query<StoreRow[]>(sql, [storeId]);

		if (rows.length !== 0) {
			data.id = rows[0].id;
			data.name = rows[0].name;
			data.address = rows[0].address;
			data.description = rows[0].description;
			data.store_group_id = rows[0].store_group_id;
			data.group_name = rows[0].group_name;
			data.updated_at = rows[0].updated_at;
			data.created_at = rows[0].created_at;
		} else {
			throw new NotFoundError();
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

export const PUT = async (req: Request, { params }: { params: { id: string } }): Promise<Response> => {
	let connection: mysql.Connection | null = null;

	try {
		connection = await mysql.createConnection(mysqlConfig as string);

		const body = await req.json();

		const name = safeString(body.name);
		const address = safeString(body.address);
		const description = safeString(body.description);
		const groupId = safeNumber(body.group);
		const storeId = safeNumber(params.id);

		if (name === null || address === null || description === null || storeId === null) {
			throw new ValidationError();
		}

		const [result] = await connection.query(
			/* sql */ `
				UPDATE
					stores
				SET
					name = ?,
					address = ?,
					description = ?,
					store_group_id = ?
				WHERE id = ? AND deleted = FALSE
			`,
			[name, address, description, groupId, storeId]
		);

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
