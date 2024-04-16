import type { GetPicturesResponse, Message } from "@/type";
import { useState } from "react";

interface ReturnType {
	response: NonNullable<GetPicturesResponse> | undefined;
	loading: boolean;
	message: Message | undefined;
	getPictures: (storeId: string) => Promise<void>;
}

export const useGetPictures = (): ReturnType => {
	const [loading, setLoading] = useState<boolean>(false);
	const [message, setMessage] = useState<Message | undefined>(undefined);
	const [response, setResponse] = useState<NonNullable<GetPicturesResponse> | undefined>(undefined);

	const getPictures = async (storeId: string): Promise<void> => {
		setLoading(true);
		setMessage(undefined);
		setResponse(undefined);

		try {
			const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/picture?storeId=${storeId}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json"
				}
			});

			if (result.status !== 200) {
				throw new Error();
			}

			const response = (await result.json()) as GetPicturesResponse;

			if (response === null) {
				throw new Error();
			}

			setResponse(response);
			setMessage({
				type: "success",
				text: "写真を取得しました"
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

	return { response, loading, message, getPictures };
};
