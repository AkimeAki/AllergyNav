import useFetchApi from "@/hooks/useFetchApi";

export default function () {
	const { fetchData, status: deleteMenuStatus } = useFetchApi();

	const deleteMenu = (menuId: string): void => {
		void fetchData("deleteMenu", { menuId }, {});
	};

	return { deleteMenu, deleteMenuStatus };
}
