import useFetchApi from "@/hooks/useFetchApi";
import type { FetchStatus, AddMenuResponse } from "@/type";

interface ReturnType {
	addMenu: (storeId: string, name: string, description: string, allergens: string[]) => void;
	addMenuResponse: NonNullable<AddMenuResponse> | undefined;
	addMenuStatus: FetchStatus;
	addMenuResponseStatus: number | undefined;
}

export default function (): ReturnType {
	const {
		fetchData,
		response: addMenuResponse,
		status: addMenuStatus,
		responseStatus: addMenuResponseStatus
	} = useFetchApi<AddMenuResponse>();

	const addMenu = (storeId: string, name: string, description: string, allergens: string[]): void => {
		void fetchData(
			"addMenu",
			{},
			{
				storeId,
				name,
				description,
				allergens: JSON.stringify(allergens)
			}
		);
	};

	return { addMenu, addMenuResponse, addMenuStatus, addMenuResponseStatus };
}
