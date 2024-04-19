"use client";

import { css } from "@kuma-ui/core";
import Button from "@/components/atoms/Button";
import { useState } from "react";
import EditStoreModal from "@/components/organisms/EditStoreModal";
import useGetUserData from "@/hooks/useGetUserData";
import useSendVerifyMail from "@/hooks/useSendVerifyMail";
import Modal from "@/components/molecules/Modal";
import SubTitle from "@/components/atoms/SubTitle";
import { useRouter } from "next/navigation";

interface Props {
	storeId: string;
}

export default function ({ storeId }: Props): JSX.Element {
	const [isOpenEditModal, setIsOpenEditModal] = useState<boolean>(false);
	const { status, userId, userVerified } = useGetUserData();
	const { sendVerifyMail, response: verifiedResponse, loading: sendVerifyLoading } = useSendVerifyMail();
	const router = useRouter();

	return (
		<>
			{status === "authenticated" && (
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
					<Modal isOpen={isOpenEditModal && userVerified === false} setIsOpen={setIsOpenEditModal}>
						<SubTitle>お店の情報を編集</SubTitle>
						<p
							className={css`
								text-align: center;
								margin: 30px 0;
							`}
						>
							お店の情報を編集するには、メール認証を完了する必要があります。
						</p>
						<div
							className={css`
								display: flex;
								justify-content: center;
							`}
						>
							<div>
								{!sendVerifyLoading && verifiedResponse === undefined && userId !== null && (
									<Button
										onClick={() => {
											void sendVerifyMail(userId);
										}}
									>
										認証メールを再送信する
									</Button>
								)}
								{sendVerifyLoading && <Button disabled>送信中</Button>}
								{!sendVerifyLoading && verifiedResponse !== undefined && (
									<Button disabled>認証メールを送信しました</Button>
								)}
							</div>
						</div>
					</Modal>
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
}
