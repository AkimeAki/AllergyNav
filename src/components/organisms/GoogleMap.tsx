"use client";

import { css } from "@kuma-ui/core";
import { useEffect, useState } from "react";
import Loading from "@/components/atoms/Loading";
import ErrorMessage from "../atoms/ErrorMessage";

interface Props {
	address: string;
}

export default function ({ address }: Props): JSX.Element {
	const [coordinate, setCoordinate] = useState<string | undefined>(undefined);
	const [loadingCoordinate, setLoadingCoordinate] = useState<boolean>(true);

	const getCoordinate = async (): Promise<void> => {
		try {
			const storeAccessFetchResponse = await fetch(
				`https://msearch.gsi.go.jp/address-search/AddressSearch?q=${address}`,
				{
					method: "GET"
				}
			);
			const storeAccessData = await storeAccessFetchResponse.json();

			if (storeAccessData.length === 1) {
				setCoordinate(
					`${storeAccessData[0].geometry.coordinates[1]},${storeAccessData[0].geometry.coordinates[0]}`
				);
			}
		} catch (e) {}
		setLoadingCoordinate(false);
	};

	useEffect(() => {
		void getCoordinate();
	}, []);

	return (
		<>
			{loadingCoordinate && <Loading />}
			{coordinate !== undefined && (
				<iframe
					src={`http://maps.google.co.jp/maps?q=${coordinate}&output=embed&t=m&z=17`}
					className={css`
						border: none;
						width: 100%;
						height: 400px;
					`}
				/>
			)}
			{!loadingCoordinate && coordinate === undefined && (
				<ErrorMessage>正確な住所情報を取得できませんでした。</ErrorMessage>
			)}
		</>
	);
}
