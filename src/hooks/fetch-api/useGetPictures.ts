import useFetchApi from "@/hooks/useFetchApi";
import type { FetchStatus, GetPicturesResponse } from "@/type";

interface ReturnType {
	getPictures: (storeId: string) => void;
	getPicturesResponse: NonNullable<GetPicturesResponse> | undefined;
	getPicturesStatus: FetchStatus;
	getPicturesResponseStatus: number | undefined;
}

export default function (): ReturnType {
	const {
		fetchData,
		response: getPicturesResponse,
		status: getPicturesStatus,
		responseStatus: getPicturesResponseStatus
	} = useFetchApi<GetPicturesResponse>();

	const getPictures = (storeId: string): void => {
		void fetchData(
			"getPictures",
			{
				storeId
			},
			{}
		);
	};

	return { getPictures, getPicturesResponse, getPicturesStatus, getPicturesResponseStatus };
}
