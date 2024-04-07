import type { GetStoreResponse, Message } from "@/type";
import { useState } from "react";

interface ReturnType {
	response: NonNullable<GetStoreResponse> | undefined;
	loading: boolean;
	message: Message | undefined;
	getStore: (storeId: string) => Promise<void>;
}

export default function (): ReturnType {
	const [loading, setLoading] = useState<boolean>(true);
	const [message, setMessage] = useState<Message | undefined>(undefined);
	const [response, setResponse] = useState<NonNullable<GetStoreResponse> | undefined>(undefined);

	const getStore = async (storeId: string): Promise<void> => {
		setLoading(true);
		setMessage(undefined);
		setResponse(undefined);

		try {
			const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store/${storeId}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json"
				}
			});

			if (result.status !== 200) {
				throw new Error();
			}

			const response = (await result.json()) as GetStoreResponse;

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
}
