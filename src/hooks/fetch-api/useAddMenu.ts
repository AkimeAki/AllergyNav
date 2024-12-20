import useFetchApi from "@/hooks/useFetchApi";
import type { FetchStatus, AddMenuResponse, AllergenStatusValue } from "@/type";

interface ReturnType {
	addMenu: (
		storeId: string,
		name: string,
		description: string,
		allergens: Record<string, AllergenStatusValue>
	) => void;
	addMenuResponse: NonNullable<AddMenuResponse> | undefined;
	addMenuStatus: FetchStatus;
	addMenuResponseStatus: number | undefined;
	addMenuReset: () => void;
}

export default function (): ReturnType {
	const {
		fetchData,
		response: addMenuResponse,
		status: addMenuStatus,
		responseStatus: addMenuResponseStatus,
		reset: addMenuReset
	} = useFetchApi<AddMenuResponse>();

	const addMenu = (
		storeId: string,
		name: string,
		description: string,
		allergens: Record<string, AllergenStatusValue>
	): void => {
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

	return { addMenu, addMenuResponse, addMenuStatus, addMenuResponseStatus, addMenuReset };
}
