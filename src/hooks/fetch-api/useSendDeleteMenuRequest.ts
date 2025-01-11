import useFetchApi from "@/hooks/useFetchApi";

export default function () {
	const { fetchData, status: sendDeleteMenuRequestStatus } = useFetchApi();

	const sendDeleteMenuRequest = (menuId: string, reason: string): void => {
		void fetchData("sendDeleteMenuRequest", {}, { menuId, reason });
	};

	return { sendDeleteMenuRequest, sendDeleteMenuRequestStatus };
}
