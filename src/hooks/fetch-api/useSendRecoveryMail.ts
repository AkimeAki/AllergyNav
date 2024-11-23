import useFetchApi from "@/hooks/useFetchApi";

export default function () {
	const { fetchData, status: sendRecoveryMailStatus } = useFetchApi();

	const sendRecoveryMail = (email: string): void => {
		void fetchData(
			"sendRecoveryMail",
			{},
			{
				email
			}
		);
	};

	return { sendRecoveryMail, sendRecoveryMailStatus };
}
