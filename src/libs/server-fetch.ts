import type { GetAllergensResponse, GetMenusResponse, GetStoreResponse, GetStoresResponse } from "@/type";
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

export const getAllergens = async (): Promise<NonNullable<GetAllergensResponse>> => {
	const serverApiKey = safeString(process.env.SERVER_API_KEY);

	if (serverApiKey === null) {
		notFound();
	}

	let allergens = null;
	try {
		const allergenFetchResult = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/allergen`, {
			method: "GET",
			cache: "no-store",
			headers: {
				Authorization: `Bearer: ${serverApiKey}`
			}
		});

		if (allergenFetchResult.status !== 200) {
			throw new Error();
		}

		allergens = (await allergenFetchResult.json()) as GetAllergensResponse;
	} catch (e) {
		allergens = null;
	}

	return allergens ?? [];
};

export const getMenus = async (storeId: string): Promise<NonNullable<GetMenusResponse>> => {
	const serverApiKey = safeString(process.env.SERVER_API_KEY);

	if (serverApiKey === null) {
		notFound();
	}

	let menus = null;
	try {
		const menusFetchResult = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/menu?keywords=&allergens=&storeId=${storeId}`,
			{
				method: "GET",
				cache: "no-store",
				headers: {
					Authorization: `Bearer: ${serverApiKey}`
				}
			}
		);

		if (menusFetchResult.status !== 200) {
			throw new Error();
		}

		menus = (await menusFetchResult.json()) as GetMenusResponse;
	} catch (e) {
		menus = null;
	}

	if (menus === null) {
		notFound();
	}

	return menus;
};
