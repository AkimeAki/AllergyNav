import { handler } from "@/libs/auth";
import { NextRequest } from "next/server";

const _handler = async (req: NextRequest, body: NextRequest["body"]) => {
	req.headers.set("x-forwarded-host", process.env.NEXTAUTH_URL ?? req.headers.get("x-forwarded-host") ?? "");
	const response = handler(req, body);
	const res = await response;
	return res;
};

export { _handler as GET, _handler as POST };
