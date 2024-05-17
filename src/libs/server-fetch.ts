import type { GetStoreResponse, GetStoresResponse } from "@/type";
import { notFound } from "next/navigation";
import { safeString } from "@/libs/safe-type";

export const getStore = async (paramId: string): Promise<NonNullable<GetStoreResponse>> => {
	const id = safeString(paramId);
	const serverApiKey = safeString(process.env.SERVER_API_KEY);

	if (id === null || serverApiKey === null) {
		notFound();
	}

	let storeDetail = null;
	try {
		const storeDetailFetchResult = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store/${id}`, {
			method: "GET",
			cache: "no-store",
			headers: {
				Authorization: `Bearer: ${serverApiKey}`
			}
		});

		if (storeDetailFetchResult.status !== 200) {
			throw new Error();
		}

		storeDetail = (await storeDetailFetchResult.json()) as GetStoreResponse;
	} catch (e) {
		storeDetail = null;
	}

	if (storeDetail === null) {
		notFound();
	}

	return storeDetail;
};

export const getStores = async (): Promise<NonNullable<GetStoresResponse>> => {
	const serverApiKey = safeString(process.env.SERVER_API_KEY);

	if (serverApiKey === null) {
		notFound();
	}

	let stores = null;
	try {
		const storeDetailFetchResult = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store`, {
			method: "GET",
			cache: "no-store",
			headers: {
				Authorization: `Bearer: ${serverApiKey}`
			}
		});

		if (storeDetailFetchResult.status !== 200) {
			throw new Error();
		}

		stores = (await storeDetailFetchResult.json()) as GetStoresResponse;
	} catch (e) {
		stores = null;
	}

	if (stores === null) {
		notFound();
	}

	return stores;
};
