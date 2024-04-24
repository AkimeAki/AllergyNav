"use client";

import { css } from "@kuma-ui/core";
import Button from "@/components/atoms/Button";
import { useState } from "react";
import EditStoreModal from "@/components/organisms/modal/EditStoreModal";
import useGetUserData from "@/hooks/useGetUserData";
import { useRouter } from "next/navigation";
import NotVerifiedModal from "@/components/molecules/NotVerifiedModal";

interface Props {
	storeId: string;
}

export default function ({ storeId }: Props): JSX.Element {
	const [isOpenEditModal, setIsOpenEditModal] = useState<boolean>(false);
	const { userStatus, userId, userVerified } = useGetUserData();
	const router = useRouter();

	return (
		<>
			<>
				<EditStoreModal
					storeId={storeId}
					isOpen={isOpenEditModal && userVerified === true}
					setIsOpen={setIsOpenEditModal}
					callback={() => {
						router.refresh();
						setIsOpenEditModal(false);
					}}
				/>
				<NotVerifiedModal
					isOpen={isOpenEditModal && userVerified === false}
					setIsOpen={setIsOpenEditModal}
					userId={userId ?? ""}
				/>
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
						disabled={userStatus === "loading"}
						loading={userStatus === "loading"}
					>
						お店の情報を編集
					</Button>
				</div>
			</>
		</>
	);
}
