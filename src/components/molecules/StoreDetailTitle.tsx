"use client";

import MainTitle from "@/components/atoms/MainTitle";
import LoadingDot from "@/components/atoms/LoadingDot";
import { useEffect, useState } from "react";
import type { Store } from "@/type";

interface Props {
	id: number;
}

export default function ({ id }: Props): JSX.Element {
	const [storeDetail, setStoreDetail] = useState<Store | undefined>(undefined);

	useEffect(() => {
		const getStoreDetail = async (): Promise<void> => {
			try {
				const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store/${id}`, {
					method: "GET"
				});

				if (result.status !== 200) {
					throw new Error();
				}

				const response = await result.json();
				setStoreDetail(response);
			} catch (e) {}
		};

		void getStoreDetail();
	}, []);

	return <MainTitle>{storeDetail !== undefined ? storeDetail.name : <LoadingDot />}</MainTitle>;
}
