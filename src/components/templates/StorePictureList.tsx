"use client";

import { css } from "@kuma-ui/core";
import { useEffect, useState } from "react";
import Image from "next/image";
import ErrorMessage from "@/components/atoms/ErrorMessage";
import Loading from "@/components/atoms/Loading";
import Button from "@/components/atoms/Button";
import AddPictureModal from "@/components/organisms/AddPictureModal";
import { useGetPictures } from "@/hooks/useGetPictures";
import useGetUserData from "@/hooks/useGetUserData";
import Modal from "@/components/molecules/Modal";
import SubTitle from "@/components/atoms/SubTitle";
import useSendVerifyMail from "@/hooks/useSendVerifyMail";
import { useFloatMessage } from "@/hooks/useFloatMessage";
import { formatText } from "@/libs/format-text";

interface Props {
	id: string;
}

export default function ({ id }: Props): JSX.Element {
	const [isOpenAddModal, setIsOpenAddModal] = useState<boolean>(false);
	const {
		response: pictures,
		loading: getPicturesLoading,
		message: getPicturesMessage,
		getPictures
	} = useGetPictures();
	const { status, userId, userVerified } = useGetUserData();
	const { sendVerifyMail, response: verifiedResponse, loading: sendVerifyLoading } = useSendVerifyMail();
	const { addMessage } = useFloatMessage();
	const [isViewPicture, setIsViewPicture] = useState<boolean>(false);
	const [viewPictureId, setViewPictureId] = useState<string>();

	useEffect(() => {
		void getPictures(id);
	}, []);

	return (
		<>
			<AddPictureModal
				storeId={id}
				isOpen={isOpenAddModal && status === "authenticated" && userVerified === true}
				setIsOpen={setIsOpenAddModal}
				callback={() => {
					addMessage("写真を追加しました！", "success", 3);
					setIsOpenAddModal(false);
					void getPictures(id);
				}}
			/>
			<Modal
				isOpen={isOpenAddModal && status === "authenticated" && userVerified === false}
				setIsOpen={setIsOpenAddModal}
			>
				<SubTitle>メニューを追加</SubTitle>
				<p
					className={css`
						text-align: center;
						margin: 30px 0;
					`}
				>
					写真を追加するには、メール認証を完了する必要があります。
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
			<Modal isOpen={isOpenAddModal && status === "unauthenticated"} setIsOpen={setIsOpenAddModal}>
				<SubTitle>お店を追加</SubTitle>
				<p
					className={css`
						text-align: center;
						margin: 30px 0;
					`}
				>
					写真を追加するには、ログインする必要があります
				</p>
				<div
					className={css`
						display: flex;
						gap: 20px;
						justify-content: center;
					`}
				>
					<div>
						<Button href={`/login?redirect=/store/${id}/menu`}>ログイン</Button>
					</div>
					<div>
						<Button href={`/register?redirect=/store/${id}/menu`}>アカウント作成</Button>
					</div>
				</div>
			</Modal>
			{pictures?.map((picture) => (
				<Modal
					key={picture.id}
					isOpen={isViewPicture && viewPictureId === picture.id}
					setIsOpen={setIsViewPicture}
				>
					<Image
						className={css`
							width: 100%;
							height: calc(100% - 10px);
							object-fit: contain;
							user-select: none;
						`}
						src={picture.url}
						width={1280}
						height={1280}
						alt="写真"
					/>
					{picture.description !== "" && (
						<div
							className={css`
								position: absolute;
								bottom: 0;
								left: 0;
								width: 100%;
								padding: 30px;
								user-select: none;
								pointer-events: none;

								@media (max-width: 880px) {
									padding: 0;
								}
							`}
						>
							<div
								className={css`
									background-color: black;
									padding: 10px;
									opacity: 0.7;
									padding: 20px;
									max-height: 120px;
									overflow-y: auto;
									border-bottom-left-radius: 15px;
									border-bottom-right-radius: 15px;

									@media (max-width: 880px) {
										border-radius: 0;
									}
								`}
							>
								<div
									className={css`
										color: white;
										user-select: text;
										pointer-events: auto;
									`}
									dangerouslySetInnerHTML={{
										__html: formatText(picture.description)
									}}
								/>
							</div>
						</div>
					)}
				</Modal>
			))}
			<div
				className={css`
					display: flex;
					flex-direction: column;
					gap: 20px;
				`}
			>
				{getPicturesLoading && <Loading />}
				{getPicturesMessage !== undefined && getPicturesMessage.type === "error" && (
					<ErrorMessage>{getPicturesMessage.text}</ErrorMessage>
				)}
				{pictures !== undefined && pictures.length === 0 && (
					<p
						className={css`
							text-align: center;
						`}
					>
						写真が無いようです😿
					</p>
				)}
				{!getPicturesLoading && pictures !== undefined && (
					<section
						className={css`
							display: grid;
							grid-template-columns: 1fr 1fr 1fr;
							gap: 20px;
						`}
					>
						{[...pictures].reverse().map((picture) => (
							<div
								key={picture.id}
								onClick={() => {
									setIsViewPicture(true);
									setViewPictureId(picture.id);
								}}
								className={css`
									transition-duration: 200ms;
									transition-property: box-shadow;
									overflow: hidden;
									aspect-ratio: 1/1;
									border-radius: 7px;
									border-width: 2px;
									border-style: solid;
									border-color: #f3f3f3;
									cursor: pointer;

									&:hover {
										box-shadow: 0px 0px 15px -10px #777777;
									}
								`}
							>
								<Image
									className={css`
										aspect-ratio: 1/1;
										width: 100%;
										height: 100%;
										object-fit: contain;
										user-select: none;
									`}
									src={picture.url}
									width={300}
									height={300}
									alt="写真"
								/>
							</div>
						))}
					</section>
				)}
				{status !== "loading" && (
					<div
						className={css`
							position: sticky;
							bottom: 40px;
							text-align: right;
							z-index: 99;

							@media (max-width: 880px) {
								bottom: 120px;
							}

							@media (max-width: 600px) {
								bottom: 90px;
							}
						`}
					>
						<Button
							onClick={() => {
								setIsOpenAddModal(true);
							}}
							selected={isOpenAddModal}
						>
							写真を追加
						</Button>
					</div>
				)}
			</div>
		</>
	);
}
