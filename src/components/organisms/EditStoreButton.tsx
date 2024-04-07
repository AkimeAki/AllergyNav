"use client";

import { css } from "@kuma-ui/core";
import Button from "@/components/atoms/Button";
import { useState } from "react";
import EditStoreModal from "@/components/organisms/EditStoreModal";
import { SessionProvider } from "next-auth/react";
import useGetUserData from "@/hooks/useGetUserData";

interface Props {
	storeId: string;
}

const EditStoreButton = ({ storeId }: Props): JSX.Element => {
	const [isOpenEditModal, setIsOpenEditModal] = useState<boolean>(false);
	const { status } = useGetUserData();

	return (
		<>
			{status === "authenticated" && (
				<>
					<EditStoreModal storeId={storeId} isOpen={isOpenEditModal} setIsOpen={setIsOpenEditModal} />
					<div
						className={css`
							text-align: right;
							z-index: 99;
							animation-name: editStoreButtonFadeIn;
							opacity: 0;
							animation-iteration-count: 1;
							animation-duration: 200ms;
							animation-fill-mode: forwards;

							@keyframes editStoreButtonFadeIn {
								0% {
									opacity: 0;
								}

								100% {
									opacity: 1;
								}
							}

							@media (max-width: 600px) {
								bottom: 20px;
							}
						`}
					>
						<Button
							onClick={() => {
								setIsOpenEditModal(true);
							}}
							selected={isOpenEditModal}
						>
							お店の情報を編集
						</Button>
					</div>
				</>
			)}
		</>
	);
};

export default function ({ storeId }: Props): JSX.Element {
	return (
		<SessionProvider>
			<EditStoreButton storeId={storeId} />
		</SessionProvider>
	);
}
