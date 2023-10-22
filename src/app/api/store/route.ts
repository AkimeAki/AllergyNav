import mysql from "mysql2/promise";
import type { RowDataPacket } from "mysql2/promise";
import { NotFoundError, ValidationError, mysqlConfig } from "@/definition";
import type { Store } from "@/type";
import { safeNumber, safeString } from "@/libs/trans-type";

interface StoreRow extends RowDataPacket {
	id: number;
	name: string;
	address: string;
	chain_id: number | null;
	chain_name: string | null;
	description: string;
	updated_at: string;
	created_at: string;
}

let status = 500;

export const GET = async (req: Request): Promise<Response> => {
	let connection: mysql.Connection | null = null;
	const data: Store[] = [];

	try {
		connection = await mysql.createConnection(mysqlConfig as string);

		const { searchParams } = new URL(req.url);
		const allergens = safeString(searchParams.get("allergens"));
		const keywords = safeString(searchParams.get("keywords"));
		const chainId = safeNumber(searchParams.get("chain"));

		let chainFilterSql = "";
		if (chainId !== null) {
			chainFilterSql = /* sql */ ` WHERE chain_id = ${chainId}`;
		}

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

					keywordFilterSql += /* sql */ ` name LIKE "%${keyword}%" OR description LIKE "%${keyword}%" OR address LIKE "%${keyword}%"`;
				});
			}
		}

		const sql = /* sql */ `
			SELECT
				stores.id as id,
				stores.name as name,
				stores.address as address,
				stores.chain_id as chain_id,
				chains.name as chain_name,
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
						stores.chain_id as chain_id,
						stores.deleted as deleted,
						stores.description as description,
						stores.updated_at as updated_at,
						stores.created_at as created_at
					FROM stores
					${
						allergenFilterSql !== ""
							? /* sql */ `
								INNER JOIN (
									SELECT
										menu.id as id,
										menu.store_id as store_id,
										menu.chain_id as chain_id,
										IFNULL(CONCAT(",", GROUP_CONCAT((allergens.id) SEPARATOR ","), ","), "") as allergen_ids
									FROM menu
											LEFT JOIN menu_allergens ON menu.id = menu_allergens.menu_id
											LEFT JOIN allergens ON menu_allergens.allergen_id = allergens.id
									GROUP BY id, store_id, chain_id
									${allergenFilterSql}
								) menu ON menu.store_id = stores.id OR menu.chain_id = stores.chain_id
							`
							: ""
					}
					GROUP BY id, name, address, chain_id, description, updated_at, created_at
					${keywordFilterSql}
				) stores
				WHERE stores.deleted = FALSE
			) stores
			LEFT JOIN chains ON chains.id = stores.chain_id
			${chainFilterSql}
		`;

		const [rows] = await connection.query<StoreRow[]>(sql);
		rows.forEach((row) => {
			data.push({
				id: row.id,
				name: row.name,
				address: row.address,
				chain_id: row.chain_id,
				chain_name: row.chain_name,
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
	const data: Store = {
		id: NaN,
		name: "",
		address: "",
		chain_id: null,
		chain_name: null,
		description: "",
		updated_at: "",
		created_at: ""
	};

	try {
		connection = await mysql.createConnection(mysqlConfig as string);

		const body = await req.json();

		const name = safeString(body.name);
		const address = safeString(body.address);
		const description = safeString(body.description);
		const chainId = safeNumber(body.chain);

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
			chain_id: chainId
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
