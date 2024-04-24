import useFetchApi from "@/hooks/useFetchApi";
import type { FetchStatus, GetAllergensResponse } from "@/type";

interface ReturnType {
	getAllergens: () => void;
	getAllergensResponse: NonNullable<GetAllergensResponse> | undefined;
	getAllergensStatus: FetchStatus;
	getAllergensResponseStatus: number | undefined;
}

export default function (): ReturnType {
	const {
		fetchData,
		response: getAllergensResponse,
		status: getAllergensStatus,
		responseStatus: getAllergensResponseStatus
	} = useFetchApi<GetAllergensResponse>();

	const getAllergens = (): void => {
		void fetchData("getAllergens", {}, {});
	};

	return { getAllergens, getAllergensResponse, getAllergensStatus, getAllergensResponseStatus };
}
