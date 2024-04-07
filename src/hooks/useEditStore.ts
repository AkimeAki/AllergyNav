import { ValidationError } from "@/definition";
import { includePostCode } from "@/libs/check-address";
import type { AddStoreResponse, Message } from "@/type";
import { normalize } from "@geolonia/normalize-japanese-addresses";
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
			if (includePostCode(address)) {
				throw new ValidationError("郵便番号は除外してください");
			}

			const normalizeResult = await normalize(address);
			switch (normalizeResult.level) {
				case 0:
					throw new ValidationError(
						"都道府県の識別ができません\n\nシステムに問題がある場合はお問い合わせください"
					);

				case 1:
					throw new ValidationError(
						"市区町村の識別ができません\n\nシステムに問題がある場合はお問い合わせください"
					);

				case 2:
					throw new ValidationError(
						"町丁目の識別ができません\n\nシステムに問題がある場合はお問い合わせください"
					);
			}

			const normalizedAddress =
				normalizeResult.pref + normalizeResult.city + normalizeResult.town + normalizeResult.addr;
			console.log(normalizedAddress);

			const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store/${storeId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					address: normalizedAddress,
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
				if (e.message !== undefined) {
					setMessage({
						type: "error",
						text: e.message
					});
				} else {
					setMessage({
						type: "error",
						text: "入力した値がおかしいです"
					});
				}
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
