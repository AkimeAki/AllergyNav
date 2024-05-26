import useFetchApi from "@/hooks/useFetchApi";

export default function () {
	const { fetchData, status: sendVerifyMailStatus } = useFetchApi();

	const sendVerifyMail = (userId: string): void => {
		void fetchData(
			"sendVerifyMail",
			{
				userId
			},
			{}
		);
	};

	return { sendVerifyMail, sendVerifyMailStatus };
}
