import type { GetStoresResponse, Message } from "@/type";
import { useState } from "react";

interface ReturnType {
	response: NonNullable<GetStoresResponse>;
	loading: boolean;
	message: Message | undefined;
	getStore: (allergens: string, keywords: string) => Promise<void>;
}

export const useGetStores = (): ReturnType => {
	const [loading, setLoading] = useState<boolean>(true);
	const [message, setMessage] = useState<Message | undefined>(undefined);
	const [response, setResponse] = useState<NonNullable<GetStoresResponse>>([]);

	const getStore = async (allergens: string, keywords: string): Promise<void> => {
		setLoading(true);
		setMessage(undefined);
		setResponse([]);

		try {
			const result = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/store?keywords=${keywords}&allergens=${allergens}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json"
					}
				}
			);

			if (result.status !== 200) {
				throw new Error();
			}

			const response = (await result.json()) as GetStoresResponse;
			if (response === null) {
				throw new Error();
			}
			setResponse(response);
			setMessage({
				type: "success",
				text: "お店を取得しました"
			});
		} catch (e) {
			setMessage({
				type: "error",
				text: "接続エラーが発生しました。"
			});
		}
		setLoading(false);
	};

	return { response, loading, message, getStore };
};
