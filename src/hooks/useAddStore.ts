import type { AddStoreResponse, Message } from "@/type";
import { useState } from "react";

interface ReturnType {
	response: NonNullable<AddStoreResponse> | undefined;
	loading: boolean;
	message: Message | undefined;
	addStore: (name: string, address: string, description: string) => Promise<void>;
}

export const useAddStore = (): ReturnType => {
	const [loading, setLoading] = useState<boolean>(false);
	const [message, setMessage] = useState<Message | undefined>(undefined);
	const [response, setResponse] = useState<NonNullable<AddStoreResponse> | undefined>(undefined);

	const addStore = async (name: string, address: string, description: string): Promise<void> => {
		setLoading(true);
		setMessage(undefined);
		setResponse(undefined);

		try {
			const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					address,
					name,
					description
				})
			});

			if (result.status !== 200) {
				throw new Error();
			}

			const response = (await result.json()) as AddStoreResponse;

			if (response === null) {
				throw new Error();
			}

			setResponse(response);
			setMessage({
				type: "success",
				text: "お店を登録しました"
			});
		} catch (e) {
			setMessage({
				type: "error",
				text: "接続エラーが発生しました"
			});
		}
		setLoading(false);
	};

	return { response, loading, message, addStore };
};
