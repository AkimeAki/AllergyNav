import mysql from "mysql2/promise";
import type { RowDataPacket } from "mysql2/promise";
import { NotFoundError, ValidationError, mysqlConfig } from "@/definition";
import type { Store } from "@/type";
import { safeNumber, safeString } from "@/libs/safe-type";

interface StoreRow extends RowDataPacket {
	id: number;
	name: string;
	address: string;
	group_id: number | null;
	description: string;
	updated_at: string;
	created_at: string;
}

export const GET = async (req: Request): Promise<Response> => {
	let connection: mysql.Connection | null = null;
	const data: Store[] = [];
	let status = 500;

	try {
		connection = await mysql.createConnection(mysqlConfig as any);

		const { searchParams } = new URL(req.url);
		const allergens = safeString(searchParams.get("allergens"));
		const keywords = safeString(searchParams.get("keywords"));
		const groupId = safeNumber(searchParams.get("group"));

		const sql = /* sql */ `
			SELECT
				stores.id as id,
				stores.name as name,
				stores.address as address,
				stores.group_id as group_id,
				stores.description as description,
				stores.updated_at as updated_at,
				stores.created_at as created_at
			FROM (
				SELECT
					*
				FROM (
					SELECT
						stores.id as id,
						stores.name as name,
						stores.address as address,
						stores.store_group_id as group_id,
						stores.deleted as deleted,
						stores.description as description,
						stores.updated_at as updated_at,
						stores.created_at as created_at
					FROM stores
					${(() => {
						if (allergens === null) {
							return "";
						}

						const allergenList = allergens.split(",").filter((allergen) => allergen !== "");
						if (allergenList.length === 0) {
							return "";
						}

						return /* sql */ `
							INNER JOIN (
								SELECT
									menu.id as id,
									menu.store_id as store_id,
									menu.group_id as group_id,
									IFNULL(CONCAT(",", GROUP_CONCAT((allergens.id) SEPARATOR ","), ","), "") as allergen_ids
								FROM menu
									LEFT JOIN menu_allergens ON menu.id = menu_allergens.menu_id
									LEFT JOIN allergens ON menu_allergens.allergen_id = allergens.id
								GROUP BY id, store_id, group_id
								${(() => {
									let allergenFilterSql = "HAVING";
									allergenList.forEach((allergen, index) => {
										if (index !== 0) {
											allergenFilterSql += /* sql */ ` AND`;
										}

										allergenFilterSql += /* sql */ ` allergen_ids NOT LIKE "%,${allergen},%"`;
									});

									return allergenFilterSql;
								})()}
							) menu ON menu.store_id = stores.id OR menu.group_id = stores.group_id
						`;
					})()}
					GROUP BY id, name, address, group_id, description, updated_at, created_at
					${(() => {
						if (keywords === null) {
							return "";
						}

						const keywordList = keywords.split(" ").filter((keyword) => keyword !== "");
						if (keywordList.length === 0) {
							return "";
						}

						let keywordFilterSql = "HAVING";
						keywordList.forEach((keyword, index) => {
							if (index !== 0) {
								keywordFilterSql += /* sql */ ` OR`;
							}

							keywordFilterSql += /* sql */ ` name LIKE "%${keyword}%" OR description LIKE "%${keyword}%" OR address LIKE "%${keyword}%"`;
						});

						return keywordFilterSql;
					})()}
				) stores
				WHERE stores.deleted = FALSE
			) stores
			LEFT JOIN store_groups ON store_groups.id = stores.group_id
			${groupId !== null ? /* sql */ `WHERE group_id = ${groupId}` : ""}
		`;

		const [rows] = await connection.query<StoreRow[]>(sql);
		rows.forEach((row) => {
			data.push({
				id: row.id,
				name: row.name,
				address: row.address,
				group_id: row.group_id,
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
	let status = 500;
	let data = {};

	try {
		connection = await mysql.createConnection(mysqlConfig as any);

		const body = await req.json();

		const name = safeString(body.name);
		const address = safeString(body.address);
		const description = safeString(body.description);
		const groupId = safeNumber(body.group);

		if (name === null || address === null || description === null) {
			throw new ValidationError();
		}

		const sql = /* sql */ `
			INSERT INTO stores SET ?
		`;

		const [result] = await connection.query(sql, {
			name,
			address,
			description,
			store_group_id: groupId
		});

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
