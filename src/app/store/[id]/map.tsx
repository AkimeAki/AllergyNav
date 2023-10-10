/** @jsxImportSource @emotion/react */
"use client";

import Loading from "@/components/atoms/Loading";
import { messagesSelector } from "@/selector/messages";
import type { Store } from "@/type";
import { css } from "@emotion/react";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";

interface Props {
	address: Store["address"];
}

export default function ({ address }: Props): JSX.Element {
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [coordinates, setCoordinates] = useState<string>("");
	const setMessages = useSetRecoilState(messagesSelector);

	useEffect(() => {
		const getCoordinates = async (): Promise<void> => {
			try {
				const response = await fetch(`https://msearch.gsi.go.jp/address-search/AddressSearch?q=${address}`);
				const data = await response.json();
				setCoordinates(`${data[0].geometry.coordinates[1]},${data[0].geometry.coordinates[0]}`);
				setTimeout(() => {
					setIsLoading(false);
				}, 2000);
			} catch (e) {
				setMessages({
					status: "error",
					message: "地図情報を取得できませんでした。"
				});
			}
		};

		void getCoordinates();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div
			css={css`
				position: relative;
				opacity: ${isLoading ? "0.6" : "1"};
			`}
		>
			<iframe
				src={`http://maps.google.co.jp/maps?q=${coordinates}&output=embed&t=m&z=17`}
				css={css`
					border: none;
					width: 100%;
					height: 400px;
					padding: 30px;
				`}
			/>
			{isLoading && (
				<div
					css={css`
						position: absolute;
						top: 0;
						left: 0;
						width: 100%;
						height: 100%;
						display: flex;
						justify-content: center;
						align-items: center;
						z-index: 999;
						cursor: wait;
					`}
				>
					<Loading />
				</div>
			)}
		</div>
	);
}
