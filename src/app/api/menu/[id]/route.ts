import mysql from "mysql2/promise";
import type { RowDataPacket } from "mysql2/promise";
import { mysqlConfig, NotFoundError, ValidationError } from "@/definition";
import type { Menu } from "@/type";
import { safeNumber, safeString } from "@/libs/safe-type";

interface MenuRow extends RowDataPacket {
	id: number;
	name: string;
	group_id: number | null;
	store_id: number | null;
	updated_at: string;
	created_at: string;
	allergens: string;
}

interface Props {
	params: {
		id: string;
	};
}

const data: Menu = {
	id: NaN,
	name: "",
	group_id: null,
	store_id: null,
	updated_at: "",
	created_at: "",
	allergens: []
};

let status = 500;

export const GET = async (_: Request, { params }: Props): Promise<Response> => {
	let connection: mysql.Connection | null = null;

	try {
		connection = await mysql.createConnection(mysqlConfig as string);

		const menuId = safeNumber(params.id);

		if (menuId === null) {
			throw new ValidationError();
		}

		const sql = /* sql */ `
			SELECT
				menu.id as id,
				menu.name as name,
				menu.store_id as store_id,
				menu.group_id as group_id,
				menu.updated_at as updated_at,
				menu.created_at as created_at,
				menu.allergens as allergens
			FROM (
				SELECT
					menu.id as id,
					menu.name as name,
					menu.store_id as store_id,
					menu.group_id as group_id,
					menu.deleted as deleted,
					menu.updated_at as updated_at,
					menu.created_at as created_at,
					IFNULL(CONCAT("[", GROUP_CONCAT((CONCAT('{"id": "', allergens.id, '", "name": "', allergens.name, '"}')) SEPARATOR ","), "]"), "[]") as allergens
				FROM menu
				LEFT JOIN menu_allergens ON menu.id = menu_allergens.menu_id
				LEFT JOIN allergens ON menu_allergens.allergen_id = allergens.id
				WHERE menu.id = ?
				GROUP BY id, name, store_id, group_id, updated_at, created_at, deleted
				HAVING deleted = FALSE
			) menu
		`;

		const [rows] = await connection.query<MenuRow[]>(sql, [menuId]);

		if (rows[0] !== undefined && rows.length !== 0) {
			data.id = rows[0].id;
			data.name = rows[0].name;
			data.store_id = rows[0].store_id;
			data.group_id = rows[0].group_id;
			data.updated_at = rows[0].updated_at;
			data.created_at = rows[0].created_at;
			data.allergens = JSON.parse(rows[0].allergens);
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

export const PUT = async (req: Request, { params }: Props): Promise<Response> => {
	let connection: mysql.Connection | null = null;

	try {
		connection = await mysql.createConnection(mysqlConfig as string);

		const body = await req.json();

		const name = safeString(body.name);
		const allergens = safeString(body.allergens);
		const groupId = safeNumber(body.group);
		const storeId = safeNumber(body.store);
		const menuId = safeNumber(params.id);

		if (name === null || allergens === null || menuId === null) {
			throw new ValidationError();
		}

		if (storeId === null && groupId === null) {
			throw new ValidationError();
		}

		const sql = /* sql */ `
			UPDATE
				stores
			SET
				name = ?,
				allergens = ?,
				store_id = ?,
				group_id = ?
			WHERE id = ? AND deleted = FALSE
		`;
		const [result] = await connection.query(sql, [name, allergens, storeId, groupId, menuId]);

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
