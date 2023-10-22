import mysql from "mysql2/promise";
import type { RowDataPacket } from "mysql2/promise";
import { NotFoundError, ValidationError, mysqlConfig } from "@/definition";
import type { Chain } from "@/type";
import { safeString } from "@/libs/trans-type";

interface ChainRow extends RowDataPacket {
	id: number;
	name: string;
	description: string;
	updated_at: string;
	created_at: string;
}

let status = 500;

export const GET = async (req: Request): Promise<Response> => {
	let connection: mysql.Connection | null = null;
	const data: Chain[] = [];

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
						chains.id as id,
						chains.name as name,
						chains.description as description,
						chains.deleted as deleted,
						chains.updated_at as updated_at,
						chains.created_at as created_at
					FROM chains
					${
						allergenFilterSql !== ""
							? /* sql */ `
								INNER JOIN (
									SELECT
										menu.id as id,
										menu.chain_id as chain_id,
										IFNULL(CONCAT(",", GROUP_CONCAT((allergens.id) SEPARATOR ","), ","), "") as allergen_ids
									FROM menu
											LEFT JOIN menu_allergens ON menu.id = menu_allergens.menu_id
											LEFT JOIN allergens ON menu_allergens.allergen_id = allergens.id
									GROUP BY id, chain_id
									${allergenFilterSql}
								) menu ON menu.chain_id = chains.id
							`
							: ""
					}
					GROUP BY id, name, description, updated_at, created_at
					${keywordFilterSql}
				) chains
				WHERE chains.deleted = FALSE
			) chains
		`;

		const [rows] = await connection.query<ChainRow[]>(sql);
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
	const data: Chain = {
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
			INSERT INTO chains SET ?
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
