import mysql from "mysql2/promise";
import type { RowDataPacket } from "mysql2/promise";
import { NotFoundError, ValidationError, mysqlConfig } from "@/definition";
import type { StoreGroup } from "@/type";
import { safeString } from "@/libs/trans-type";

interface StoreGroupRow extends RowDataPacket {
	id: number;
	name: string;
	description: string;
	updated_at: string;
	created_at: string;
}

let status = 500;

export const GET = async (req: Request): Promise<Response> => {
	let connection: mysql.Connection | null = null;
	const data: StoreGroup[] = [];

	try {
		connection = await mysql.createConnection(mysqlConfig as string);

		const { searchParams } = new URL(req.url);

		const allergens = safeString(searchParams.get("allergens"));
		const keywords = safeString(searchParams.get("keywords"));

		let allergenFilterSql = "";
		if (allergens !== null) {
			const allergenList = allergens.split(",").filter((allergen) => allergen !== "");
			if (allergenList.length !== 0) {
				allergenFilterSql += "HAVING";
				allergenList.forEach((allergen, index) => {
					if (index !== 0) {
						allergenFilterSql += /* sql */ ` AND`;
					}

					allergenFilterSql += /* sql */ ` allergen_ids NOT LIKE "%,${allergen},%"`;
				});
			}
		}

		let keywordFilterSql = "";
		if (keywords !== null) {
			const keywordList = keywords.split(" ").filter((keyword) => keyword !== "");
			if (keywordList.length !== 0) {
				keywordFilterSql += "HAVING";

				keywordList.forEach((keyword, index) => {
					if (index !== 0) {
						keywordFilterSql += /* sql */ ` OR`;
					}

					keywordFilterSql += /* sql */ ` name LIKE "%${keyword}%" OR description LIKE "%${keyword}%"`;
				});
			}
		}

		const sql = /* sql */ `
			SELECT
				id,
				name,
				description,
				updated_at,
				created_at
			FROM (
				SELECT
					*
				FROM (
					SELECT
						store_groups.id as id,
						store_groups.name as name,
						store_groups.description as description,
						store_groups.deleted as deleted,
						store_groups.updated_at as updated_at,
						store_groups.created_at as created_at
					FROM store_groups
					${
						allergenFilterSql !== ""
							? /* sql */ `
								INNER JOIN (
									SELECT
										menu.id as id,
										menu.group_id as group_id,
										IFNULL(CONCAT(",", GROUP_CONCAT((allergens.id) SEPARATOR ","), ","), "") as allergen_ids
									FROM menu
											LEFT JOIN menu_allergens ON menu.id = menu_allergens.menu_id
											LEFT JOIN allergens ON menu_allergens.allergen_id = allergens.id
									GROUP BY id, group_id
									${allergenFilterSql}
								) menu ON menu.group_id = store_groups.id
							`
							: ""
					}
					GROUP BY id, name, description, updated_at, created_at
					${keywordFilterSql}
				) store_groups
				WHERE store_groups.deleted = FALSE
			) store_groups
		`;

		const [rows] = await connection.query<StoreGroupRow[]>(sql);
		rows.forEach((row) => {
			data.push({
				id: row.id,
				name: row.name,
				description: row.description,
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
	const data: StoreGroup = {
		id: NaN,
		name: "",
		description: "",
		updated_at: "",
		created_at: ""
	};

	try {
		connection = await mysql.createConnection(mysqlConfig as string);

		const body = await req.json();

		const name = safeString(body.name);
		const description = safeString(body.description);

		if (name === null || description === null) {
			throw new ValidationError();
		}

		const sql = /* sql */ `
			INSERT INTO store_groups SET ?
		`;
		const [result] = await connection.query(sql, {
			name,
			description
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
