import type { GetMenusResponse, Message } from "@/type";
import { useState } from "react";

interface ReturnType {
	response: NonNullable<GetMenusResponse>;
	loading: boolean;
	message: Message | undefined;
	getMenus: (allergens: string, keywords: string, storeId: bigint) => Promise<void>;
}

export const useGetMenus = (): ReturnType => {
	const [loading, setLoading] = useState<boolean>(true);
	const [message, setMessage] = useState<Message | undefined>(undefined);
	const [response, setResponse] = useState<NonNullable<GetMenusResponse>>([]);

	const getMenus = async (allergens: string, keywords: string, storeId: bigint): Promise<void> => {
		setLoading(true);
		setMessage(undefined);
		setResponse([]);

		try {
			const result = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/menu?keywords=${keywords}&allergens=${allergens}&storeId=${storeId}`,
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

			const response = (await result.json()) as GetMenusResponse;

			if (response === null) {
				throw new Error();
			}

			setResponse(response);
			setMessage({
				type: "success",
				text: "メニューを取得しました"
			});
		} catch (e) {
			setMessage({
				type: "error",
				text: "接続エラーが発生しました。"
			});
		}
		setLoading(false);
	};

	return { response, loading, message, getMenus };
};
