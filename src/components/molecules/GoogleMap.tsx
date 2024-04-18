"use client";

import { css } from "@kuma-ui/core";
import { useEffect, useState } from "react";
import Loading from "@/components/atoms/Loading";
import { normalize } from "@geolonia/normalize-japanese-addresses";
import { safeString } from "@/libs/safe-type";

interface Props {
	address: string;
}

export default function ({ address }: Props): JSX.Element {
	const [coordinate, setCoordinate] = useState<string | undefined>(undefined);
	const [loadingCoordinate, setLoadingCoordinate] = useState<boolean>(true);

	const getCoordinate = async (): Promise<void> => {
		const normalizeResult = await normalize(address);

		const latitude = safeString(normalizeResult.lat);
		const longitude = safeString(normalizeResult.lng);
		if (latitude !== null && longitude !== null) {
			setCoordinate(`${latitude},${longitude}`);
		}
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
					src={`https://maps.google.co.jp/maps?q=${coordinate}&output=embed&t=m&z=17`}
					className={css`
						border: none;
						width: 100%;
						height: 400px;
					`}
				/>
			)}
		</>
	);
}
