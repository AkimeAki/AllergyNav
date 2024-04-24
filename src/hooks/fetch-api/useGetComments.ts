import useFetchApi from "@/hooks/useFetchApi";
import type { FetchStatus, GetCommentsResponse } from "@/type";

interface ReturnType {
	getComments: (storeId: string) => void;
	getCommentsResponse: NonNullable<GetCommentsResponse> | undefined;
	getCommentsStatus: FetchStatus;
	getCommentsResponseStatus: number | undefined;
}

export default function (): ReturnType {
	const {
		fetchData,
		response: getCommentsResponse,
		status: getCommentsStatus,
		responseStatus: getCommentsResponseStatus
	} = useFetchApi<GetCommentsResponse>();

	const getComments = (storeId: string): void => {
		void fetchData(
			"getComments",
			{
				storeId
			},
			{}
		);
	};

	return { getComments, getCommentsResponse, getCommentsStatus, getCommentsResponseStatus };
}
