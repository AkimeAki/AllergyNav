import useFetchApi from "@/hooks/useFetchApi";
import type { FetchStatus, EditMenuResponse } from "@/type";

interface ReturnType {
	editMenu: (menuId: string, name: string, description: string, allergens: string[]) => void;
	editMenuResponse: NonNullable<EditMenuResponse> | undefined;
	editMenuStatus: FetchStatus;
	editMenuResponseStatus: number | undefined;
}

export default function (): ReturnType {
	const {
		fetchData,
		response: editMenuResponse,
		status: editMenuStatus,
		responseStatus: editMenuResponseStatus
	} = useFetchApi<EditMenuResponse>();

	const editMenu = (menuId: string, name: string, description: string, allergens: string[]): void => {
		void fetchData(
			"editMenu",
			{
				menuId
			},
			{
				name,
				description,
				allergens: JSON.stringify(allergens)
			}
		);
	};

	return { editMenu, editMenuResponse, editMenuStatus, editMenuResponseStatus };
}
