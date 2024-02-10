import mysql from "mysql2/promise";
import type { RowDataPacket } from "mysql2/promise";
import { mysqlConfig, NotFoundError, ValidationError } from "@/definition";
import type { StoreGroup } from "@/type";
import { safeNumber, safeString } from "@/libs/safe-type";

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

export const GET = async (_: Request, { params }: Props): Promise<Response> => {
	let status = 500;
	let connection: mysql.Connection | null = null;

	let data = {};

	try {
		connection = await mysql.createConnection(mysqlConfig as any);

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
				stores.store_group_id as group_id,
				stores.updated_at as updated_at,
				stores.created_at as created_at
			FROM stores
			LEFT JOIN store_groups ON store_groups.id = stores.store_group_id
			WHERE stores.id = ? AND stores.deleted = FALSE
		`;
		const [rows] = await connection.query<StoreRow[]>(sql, [storeId]);

		if (rows.length !== 0) {
			data = {
				id: rows[0].id,
				name: rows[0].name,
				address: rows[0].address,
				description: rows[0].description,
				group_id: rows[0].group_id,
				updated_at: rows[0].updated_at,
				created_at: rows[0].created_at
			};
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
	let status = 500;
	let connection: mysql.Connection | null = null;
	let data = {};

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
			data = {
				id: result.insertId,
				name,
				address,
				description,
				store_group_id: groupId
			};
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
