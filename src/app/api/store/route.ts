import mysql from "mysql2/promise";
import type { RowDataPacket } from "mysql2/promise";
import { NotFoundError, ValidationError, mysqlConfig } from "@/definition";
import type { Store } from "@/type";
import { safeString } from "@/libs/safe-type";
import type { NextRequest } from "next/server";

interface StoreRow extends RowDataPacket {
	id: number;
	name: string;
	address: string;
	description: string;
	updated_at: string;
	created_at: string;
}

export const GET = async (req: NextRequest): Promise<Response> => {
	let connection: mysql.Connection | null = null;
	const data: Store[] = [];
	let status = 500;

	try {
		connection = await mysql.createConnection(mysqlConfig as any);

		const { searchParams } = new URL(req.url);
		const allergens = safeString(searchParams.get("allergens"));
		const keywords = safeString(searchParams.get("keywords"));

		const sql = /* sql */ `
			SELECT
				stores.id as id,
				stores.ip as ip,
				stores.name as name,
				stores.address as address,
				stores.description as description,
				stores.updated_at as updated_at,
				stores.created_at as created_at
			FROM (
				SELECT
					stores.id as id,
					stores.ip as ip,
					stores.name as name,
					stores.address as address,
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
								IFNULL(CONCAT(",", GROUP_CONCAT((menu_allergens.allergen_id) SEPARATOR ","), ","), "") as allergen_ids
							FROM menu
								LEFT JOIN menu_allergens ON menu.id = menu_allergens.menu_id
						GROUP BY id, store_id
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
						) menu ON menu.store_id = stores.id
					`;
				})()}
				WHERE stores.deleted = FALSE
				GROUP BY id, name, address, description, updated_at, created_at
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
		`;

		const [rows] = await connection.query<StoreRow[]>(sql);
		rows.forEach((row) => {
			data.push({
				id: row.id,
				ip: row.ip,
				name: row.name,
				address: row.address,
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

export const POST = async (req: NextRequest): Promise<Response> => {
	let connection: mysql.Connection | null = null;
	let status = 500;
	let data = {};

	try {
		connection = await mysql.createConnection(mysqlConfig as any);

		const body = await req.json();

		const name = safeString(body.name);
		const address = safeString(body.address);
		const description = safeString(body.description);
		const ip = req.ip ?? "";

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
			ip
		});

		if (!Array.isArray(result)) {
			data = {
				id: result.insertId,
				name,
				address,
				description,
				ip
			};
		}

		status = 200;
	} catch (e) {
		console.log(e);
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
