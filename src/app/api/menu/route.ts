import mysql from "mysql2/promise";
import type { RowDataPacket } from "mysql2/promise";
import { NotFoundError, ValidationError, mysqlConfig } from "@/definition";
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

let status = 500;

export const GET = async (req: Request): Promise<Response> => {
	let connection: mysql.Connection | null = null;
	const data: Menu[] = [];

	try {
		connection = await mysql.createConnection(mysqlConfig as string);

		const { searchParams } = new URL(req.url);
		const storeId = safeNumber(searchParams.get("store"));
		const groupId = safeNumber(searchParams.get("group"));

		let storeFilterSql = "";
		if (storeId !== null) {
			storeFilterSql = /* sql */ `
				WHERE menu.store_id = ${storeId}
			`;
		}

		let groupFilterSql = "";
		if (groupId !== null) {
			groupFilterSql = /* sql */ `
				WHERE menu.group_id = ${groupId}
			`;
		}

		const sql = /* sql */ `
			SELECT
				menu.id as id,
				menu.name as name,
				menu.store_id as store_id,
				menu.group_id as group_id,
				menu.updated_at as updated_at,
				menu.created_at as created_at,
				IFNULL(CONCAT("[", GROUP_CONCAT((CONCAT('{"id": "', allergens.id, '", "name": "', allergens.name, '"}')) SEPARATOR ","), "]"), "[]") as allergens
			FROM (
				SELECT
					id,
					name,
					store_id,
					group_id,
					updated_at,
					created_at
				FROM menu
				WHERE deleted = FALSE
			) menu
			LEFT JOIN menu_allergens ON menu.id = menu_allergens.menu_id
			LEFT JOIN allergens ON menu_allergens.allergen_id = allergens.id
			${storeFilterSql}
			${groupFilterSql}
			GROUP BY id, name, store_id, group_id, updated_at, created_at
		`;

		const [rows] = await connection.query<MenuRow[]>(sql);
		rows.forEach((row) => {
			data.push({
				id: row.id,
				name: row.name,
				group_id: row.group_id,
				store_id: row.store_id,
				updated_at: row.updated_at,
				created_at: row.created_at,
				allergens: JSON.parse(row.allergens)
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
	const data: Menu = {
		id: NaN,
		name: "",
		group_id: null,
		store_id: null,
		updated_at: "",
		created_at: "",
		allergens: []
	};

	try {
		connection = await mysql.createConnection(mysqlConfig as string);

		const body = await req.json();

		const name = safeString(body.name);
		const allergens = safeString(body.allergens);
		const groupId = safeNumber(body.group);
		const storeId = safeNumber(body.store);

		if (name === null) {
			throw new ValidationError();
		}

		const values: {
			name: string;
			store_id?: number;
			group_id?: number;
		} = {
			name
		};

		if (storeId === null && groupId === null) {
			throw new ValidationError();
		}

		if (storeId !== null) {
			values.store_id = storeId;
		} else if (groupId !== null) {
			values.group_id = groupId;
		}

		await connection.beginTransaction();
		const [menuResult] = await connection.query(
			/* sql */ `
				INSERT INTO menu SET ?
			`,
			values
		);

		if (!Array.isArray(menuResult)) {
			data.id = menuResult.insertId;
		} else {
			throw new Error();
		}
		if (allergens !== null) {
			const allergenList = JSON.parse(allergens) as string[];
			if (allergenList.length !== 0) {
				const menuAllergens: Array<string | number> = [];

				allergenList.forEach((allergen) => {
					menuAllergens.push(allergen);
					menuAllergens.push(data.id);
				});

				let value = "";
				for (let i = 0; i < allergenList.length; i++) {
					if (i !== 0) {
						value += ", (?, ?)";
					} else {
						value += "(?, ?)";
					}
				}

				await connection.query(
					/* sql */ `
				INSERT INTO menu_allergens (allergen_id, menu_id) VALUES ${value}
			`,
					menuAllergens
				);
			}
		}

		await connection.commit();

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
