import { handler } from "@/libs/auth";
import { NextRequest } from "next/server";

const _handler = async (req: NextRequest, body: NextRequest["body"]) => {
	const _req = req;
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-expect-error
	_req.headers["x-forwarded-host"] = process.env.NEXTAUTH_URL || _req.headers["x-forwarded-host"];
	const response = handler(_req, body);
	const res = await response;
	return res;
};

export { _handler as GET, _handler as POST };
