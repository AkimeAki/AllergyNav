import useFetchApi from "@/hooks/useFetchApi";
import type { FetchStatus, GetPictureResponse } from "@/type";

interface ReturnType {
	getPicture: (storeId: string) => void;
	getPictureResponse: NonNullable<GetPictureResponse> | undefined;
	getPictureStatus: FetchStatus;
	getPictureResponseStatus: number | undefined;
}

export default function (): ReturnType {
	const {
		fetchData,
		response: getPictureResponse,
		status: getPictureStatus,
		responseStatus: getPictureResponseStatus
	} = useFetchApi<GetPictureResponse>();

	const getPicture = (pictureId: string): void => {
		void fetchData(
			"getPicture",
			{
				pictureId
			},
			{}
		);
	};

	return { getPicture, getPictureResponse, getPictureStatus, getPictureResponseStatus };
}
