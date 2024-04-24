import useFetchApi from "@/hooks/useFetchApi";
import type { FetchStatus, AddMenuResponse } from "@/type";

interface ReturnType {
	addPicture: (storeId: string, file: File, description: string, menuId?: string) => Promise<void>;
	addPictureResponse: NonNullable<AddMenuResponse> | undefined;
	addPictureStatus: FetchStatus;
	addPictureResponseStatus: number | undefined;
}

export default function (): ReturnType {
	const {
		fetchData,
		response: addPictureResponse,
		status: addPictureStatus,
		responseStatus: addPictureResponseStatus
	} = useFetchApi<AddMenuResponse>();

	const addPicture = async (storeId: string, file: File, description: string, menuId?: string): Promise<void> => {
		const buffer = Buffer.from(await file.arrayBuffer());

		void fetchData(
			"addPicture",
			{},
			{
				storeId,
				arrayBuffer: JSON.stringify(buffer),
				description,
				menuId
			}
		);
	};

	return { addPicture, addPictureResponse, addPictureStatus, addPictureResponseStatus };
}
