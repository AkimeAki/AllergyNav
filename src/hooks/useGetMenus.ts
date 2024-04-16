import type { GetMenusResponse, Message } from "@/type";
import { useState } from "react";

interface ReturnType {
	response: NonNullable<GetMenusResponse> | undefined;
	loading: boolean;
	message: Message | undefined;
	getMenus: (allergens: string, keywords: string, storeId: string) => Promise<void>;
}

export const useGetMenus = (): ReturnType => {
	const [loading, setLoading] = useState<boolean>(false);
	const [message, setMessage] = useState<Message | undefined>(undefined);
	const [response, setResponse] = useState<NonNullable<GetMenusResponse> | undefined>(undefined);

	const getMenus = async (allergens: string, keywords: string, storeId: string): Promise<void> => {
		setLoading(true);
		setMessage(undefined);
		setResponse(undefined);

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
			setResponse(undefined);

			setMessage({
				type: "error",
				text: "接続エラーが発生しました。"
			});
		}
		setLoading(false);
	};

	return { response, loading, message, getMenus };
};
