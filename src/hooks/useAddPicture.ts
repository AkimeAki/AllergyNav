import { ValidationError } from "@/definition";
import type { AddPictureResponse, Message } from "@/type";
import { useState } from "react";

interface ReturnType {
	response: NonNullable<AddPictureResponse> | undefined;
	loading: boolean;
	message: Message | undefined;
	addPicture: (storeId: string, file: File, description: string, menuId?: string) => Promise<void>;
}

export const useAddPicture = (): ReturnType => {
	const [loading, setLoading] = useState<boolean>(false);
	const [message, setMessage] = useState<Message | undefined>(undefined);
	const [response, setResponse] = useState<NonNullable<AddPictureResponse> | undefined>(undefined);

	const addPicture = async (storeId: string, file: File, description: string, menuId?: string): Promise<void> => {
		setLoading(true);
		setMessage(undefined);
		setResponse(undefined);

		try {
			const buffer = Buffer.from(await file.arrayBuffer());

			const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/picture`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					storeId,
					arrayBuffer: JSON.stringify(buffer),
					description,
					menuId
				})
			});

			if (result.status === 422) {
				throw new ValidationError("入力値が正しくありません。");
			}

			if (result.status !== 200) {
				throw new Error();
			}

			const response = (await result.json()) as AddPictureResponse;

			if (response === null) {
				throw new Error();
			}

			setResponse(response);
			setMessage({
				type: "success",
				text: "写真を登録しました。"
			});
		} catch (e) {
			if (e instanceof ValidationError) {
				setMessage({
					type: "error",
					text: "入力した値がおかしいです🙀"
				});
			} else {
				setMessage({
					type: "error",
					text: "接続エラーが発生しました😹"
				});
			}
		}
		setLoading(false);
	};

	return { response, loading, message, addPicture };
};
