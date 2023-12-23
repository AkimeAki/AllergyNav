import mysql from "mysql2/promise";
import type { RowDataPacket } from "mysql2/promise";
import { mysqlConfig, NotFoundError, ValidationError } from "@/definition";
import type { StoreGroup } from "@/type";
import { safeNumber, safeString } from "@/libs/trans-type";

interface StoreGroupRow extends RowDataPacket {
	id: number;
	name: string;
	description: string;
	updated_at: string;
	created_at: string;
}

interface Props {
	params: {
		id: string;
	};
}

const data: StoreGroup = {
	id: NaN,
	name: "",
	description: "",
	updated_at: "",
	created_at: ""
};

let status = 500;

export const GET = async (_: Request, { params }: Props): Promise<Response> => {
	let connection: mysql.Connection | null = null;

	try {
		connection = await mysql.createConnection(mysqlConfig as string);

		const groupId = safeNumber(params.id);

		if (groupId === null) {
			throw new ValidationError();
		}

		const sql = /* sql */ `
			SELECT
				id,
				name,
				description,
				updated_at,
				created_at
			FROM
				store_groups
			WHERE id = ? AND deleted = FALSE
		`;

		const [rows] = await connection.query<StoreGroupRow[]>(sql, [groupId]);

		if (rows.length !== 0) {
			data.id = rows[0].id;
			data.name = rows[0].name;
			data.description = rows[0].description;
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
		const description = safeString(body.description);
		const groupId = safeNumber(params.id);

		if (name === null || description === null || groupId === null) {
			throw new ValidationError();
		}

		const [result] = await connection.query(
			/* sql */ `
				UPDATE
					store_groups
				SET
					name = ?,
					description = ?,
				WHERE id = ? AND deleted = FALSE
			`,
			[name, description, groupId]
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
