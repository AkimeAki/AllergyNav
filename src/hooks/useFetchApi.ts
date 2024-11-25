import { TooManyRequestError, ValidationError } from "@/definition";
import { getStatus } from "@/libs/get-status";
import type { FetchStatus } from "@/type";
import { useState } from "react";

export default function <T>(initStatus: FetchStatus) {
	const [responseStatus, setResponseStatus] = useState<number | undefined>(undefined);
	const [response, setResponse] = useState<NonNullable<T> | undefined>(undefined);
	const [status, setStatus] = useState<FetchStatus>(initStatus);

	const fetchData = async (
		type:
			| "getMenus"
			| "sendVerifyMail"
			| "sendRecoveryMail"
			| "addComment"
			| "getComments"
			| "addMenu"
			| "getAllergens"
			| "addStore"
			| "addPicture"
			| "addUser"
			| "editMenu"
			| "editStore"
			| "getMenu"
			| "getMenuHistories"
			| "getPictures"
			| "getPicture"
			| "editPicture"
			| "getStore"
			| "getStores"
			| "changePassword",
		params: Record<string, string | undefined>,
		value: Record<string, string | undefined>
	): Promise<void> => {
		setStatus("loading");
		setResponseStatus(undefined);
		setResponse(undefined);

		try {
			const options: { url: string; method: "GET" | "POST" | "PUT" } = (() => {
				switch (type) {
					case "getAllergens":
						return {
							url: `${process.env.NEXT_PUBLIC_API_URL}/allergen`,
							method: "GET"
						};

					case "getMenus":
						return {
							url: `${process.env.NEXT_PUBLIC_API_URL}/menu?keywords=${params.keywords ?? ""}&allergens=${
								params.allergens ?? ""
							}&storeId=${params.storeId ?? ""}`,
							method: "GET"
						};

					case "getMenu":
						if (params.menuId === undefined) {
							throw new Error();
						}

						return {
							url: `${process.env.NEXT_PUBLIC_API_URL}/menu/${params.menuId}`,
							method: "GET"
						};

					case "addMenu":
						return {
							url: `${process.env.NEXT_PUBLIC_API_URL}/menu`,
							method: "POST"
						};

					case "editMenu":
						if (params.menuId === undefined) {
							throw new Error();
						}

						return {
							url: `${process.env.NEXT_PUBLIC_API_URL}/menu/${params.menuId}`,
							method: "PUT"
						};

					case "sendVerifyMail":
						if (params.userId === undefined) {
							throw new Error();
						}

						return {
							url: `${process.env.NEXT_PUBLIC_API_URL}/user/${params.userId}/verify`,
							method: "POST"
						};

					case "sendRecoveryMail":
						return {
							url: `${process.env.NEXT_PUBLIC_API_URL}/user/recovery`,
							method: "POST"
						};

					case "getComments":
						if (params.storeId === undefined) {
							throw new Error();
						}

						return {
							url: `${process.env.NEXT_PUBLIC_API_URL}/store/${params.storeId}/comment`,
							method: "GET"
						};

					case "addComment":
						if (params.storeId === undefined) {
							throw new Error();
						}

						return {
							url: `${process.env.NEXT_PUBLIC_API_URL}/store/${params.storeId}/comment`,
							method: "POST"
						};

					case "getPictures":
						if (params.storeId === undefined) {
							throw new Error();
						}

						return {
							url: `${process.env.NEXT_PUBLIC_API_URL}/picture?storeId=${params.storeId}`,
							method: "GET"
						};

					case "getPicture":
						if (params.pictureId === undefined) {
							throw new Error();
						}

						return {
							url: `${process.env.NEXT_PUBLIC_API_URL}/picture/${params.pictureId}`,
							method: "GET"
						};

					case "editPicture":
						if (params.pictureId === undefined) {
							throw new Error();
						}

						return {
							url: `${process.env.NEXT_PUBLIC_API_URL}/picture/${params.pictureId}`,
							method: "PUT"
						};

					case "addPicture":
						return {
							url: `${process.env.NEXT_PUBLIC_API_URL}/picture`,
							method: "POST"
						};

					case "getStores": {
						const page = Number(params.page ?? 1);
						const limit = 10;
						const offset = (page - 1) * limit;

						return {
							url: `${process.env.NEXT_PUBLIC_API_URL}/store?keywords=${
								params.keywords ?? ""
							}&allergens=${params.allergens ?? ""}&area=${params.area ?? ""}&coords=${
								params.coords ?? ""
							}&radius=${params.radius ?? ""}&offset=${offset}&limit=${limit}`,
							method: "GET"
						};
					}

					case "getStore":
						if (params.storeId === undefined) {
							throw new Error();
						}

						return {
							url: `${process.env.NEXT_PUBLIC_API_URL}/store/${params.storeId}`,
							method: "GET"
						};

					case "addStore":
						return {
							url: `${process.env.NEXT_PUBLIC_API_URL}/store`,
							method: "POST"
						};

					case "editStore":
						if (params.storeId === undefined) {
							throw new Error();
						}

						return {
							url: `${process.env.NEXT_PUBLIC_API_URL}/store/${params.storeId}`,
							method: "PUT"
						};

					case "addUser":
						return {
							url: `${process.env.NEXT_PUBLIC_API_URL}/user`,
							method: "POST"
						};

					case "changePassword":
						return {
							url: `${process.env.NEXT_PUBLIC_API_URL}/user/recovery/${params.recoveryCode}`,
							method: "PUT"
						};

					case "getMenuHistories":
						if (params.menuId === undefined) {
							throw new Error();
						}

						return {
							url: `${process.env.NEXT_PUBLIC_API_URL}/menu/${params.menuId}/history`,
							method: "GET"
						};

					default:
						throw new Error();
				}
			})();

			const result = await fetch(options.url, {
				method: options.method,
				headers: {
					"Content-Type": "application/json"
				},
				body: options.method === "POST" || options.method === "PUT" ? JSON.stringify(value) : undefined
			});

			setResponseStatus(result.status);

			if (result.status === 422) {
				throw new ValidationError();
			}

			if (result.status === 429) {
				throw new TooManyRequestError();
			}

			if (result.status !== 200) {
				throw new Error();
			}

			const response = (await result.json()) as T;

			if (response !== null) {
				setResponse(response);
			}
			setStatus("successed");
		} catch (e) {
			console.log(e);

			const errorStatus = getStatus(e);

			if (errorStatus === 429) {
				setStatus("blocked");
			} else {
				setStatus("failed");
			}

			setResponse(undefined);
		}
	};

	const reset = () => {
		setResponse(undefined);
		setStatus("yet");
	};

	return { response, status, responseStatus, fetchData, reset };
}
