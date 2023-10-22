import mysql from "mysql2/promise";
import { NotFoundError, ValidationError, mysqlConfig } from "@/definition";
import { safeString } from "@/libs/trans-type";

let status = 500;

export const POST = async (req: Request): Promise<Response> => {
	let connection: mysql.Connection | null = null;

	try {
		connection = await mysql.createConnection(mysqlConfig as string);

		const body = await req.json();

		const email = safeString(body.email);
		const password = safeString(body.password);

		if (email === null || password === null) {
			throw new ValidationError();
		}

		await connection.beginTransaction();

		const sql = /* sql */ `
			SELECT id FROM users WHERE email = ?
		`;

		const a = await connection.query(sql, [email]);

		console.log(a);

		// if (Array.isArray(result)) {
		// 	throw new Error();
		// }

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

	return new Response("", {
		status
	});
};
