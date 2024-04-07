import { ValidationError } from "@/definition";
import type { AddStoreResponse, Message } from "@/type";
import { useState } from "react";

interface ReturnType {
	response: NonNullable<AddStoreResponse> | undefined;
	loading: boolean;
	message: Message | undefined;
	editStore: (storeId: string, name: string, address: string, description: string) => Promise<void>;
}

export const useEditStore = (): ReturnType => {
	const [loading, setLoading] = useState<boolean>(false);
	const [message, setMessage] = useState<Message | undefined>(undefined);
	const [response, setResponse] = useState<NonNullable<AddStoreResponse> | undefined>(undefined);

	const editStore = async (storeId: string, name: string, address: string, description: string): Promise<void> => {
		setLoading(true);
		setMessage(undefined);
		setResponse(undefined);

		try {
			const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store/${storeId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					address,
					name,
					description
				})
			});

			if (result.status === 422) {
				throw new ValidationError("入力値が正しくありません。");
			}

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
			if (e instanceof ValidationError) {
				setMessage({
					type: "error",
					text: "入力した値がおかしいです"
				});
			} else {
				setMessage({
					type: "error",
					text: "接続エラーが発生しました"
				});
			}
		}
		setLoading(false);
	};

	return { response, loading, message, editStore };
};
