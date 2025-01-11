import { notFound } from "next/navigation";
import { safeString } from "@/libs/safe-type";
import { headers } from "next/headers";

export const serverApiFetch = async <T>(path: string): Promise<T | null> => {
	let result = null;
	try {
		const serverApiKey = safeString(process.env.SERVER_API_KEY);

		if (serverApiKey === null) {
			notFound();
		}

		const requestHeaders = new Headers(headers());
		requestHeaders.set("Authorization", `Bearer: ${serverApiKey}`);

		const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
			method: "GET",
			cache: "no-store",
			headers: requestHeaders
		});

		if (response.status !== 200) {
			throw new Error();
		}

		result = (await response.json()) as T;
	} catch (e) {
		result = null;
	}

	return result;
};
