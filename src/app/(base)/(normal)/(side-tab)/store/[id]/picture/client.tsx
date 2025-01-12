"use client";

import { css } from "@kuma-ui/core";
import { Fragment, useEffect, useState } from "react";
import Image from "next/image";
import Button from "@/components/atoms/Button";
import AddPictureModal from "@/components/organisms/modal/AddPictureModal";
import useGetPictures from "@/hooks/fetch-api/useGetPictures";
import useGetUserData from "@/hooks/useGetUserData";
import Modal from "@/components/molecules/Modal";
import { useFloatMessage } from "@/hooks/useFloatMessage";
import { formatText } from "@/libs/format-text";
import NotVerifiedModal from "@/components/molecules/NotVerifiedModal";
import NotLoginedModal from "@/components/molecules/NotLoginedModal";
import LoadingCircleCenter from "@/components/atoms/LoadingCircleCenter";
import GoogleIcon from "@/components/atoms/GoogleIcon";
import EditPictureModal from "@/components/organisms/modal/EditPictureModal";

interface Props {
	storeId: string;
}

export default function ({ storeId }: Props): JSX.Element {
	const [isOpenAddModal, setIsOpenAddModal] = useState<boolean>(false);
	const { getPicturesResponse, getPicturesStatus, getPictures } = useGetPictures();
	const { userStatus, userId, userVerified } = useGetUserData();
	const { addMessage } = useFloatMessage();
	const [isViewPicture, setIsViewPicture] = useState<boolean>(false);
	const [viewPictureId, setViewPictureId] = useState<string>();
	const [openEditModalId, setOpenEditModalId] = useState<string>();
	const [isOpenEditModal, setIsOpenEditModal] = useState<boolean>(false);

	useEffect(() => {
		getPictures(storeId);
	}, []);

	return (
		<>
			<AddPictureModal
				storeId={storeId}
				isOpen={isOpenAddModal && userStatus === "authenticated" && userVerified === true}
				setIsOpen={setIsOpenAddModal}
				callback={() => {
					addMessage("写真を追加しました！", "success", 3);
					setIsOpenAddModal(false);
					getPictures(storeId);
				}}
			/>
			<NotVerifiedModal
				isOpen={isOpenAddModal && userVerified === false}
				setIsOpen={setIsOpenAddModal}
				userId={userId ?? ""}
			/>
			<NotLoginedModal
				isOpen={isOpenAddModal && userStatus === "unauthenticated"}
				setIsOpen={setIsOpenAddModal}
			/>
			{getPicturesResponse?.map((picture) => (
				<Fragment key={picture.id}>
					<Modal
						isOpen={isViewPicture && viewPictureId === picture.id && !isOpenEditModal}
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
						<div
							className={css`
								position: absolute;
								top: 55px;
								right: 55px;
								z-index: 99;

								@media (max-width: 880px) {
									top: 15px;
									right: 15px;
								}
							`}
						>
							<Button
								size="tiny"
								disabled={userStatus !== "authenticated"}
								loading={userStatus === "loading"}
								onClick={() => {
									if (userStatus === "authenticated") {
										setOpenEditModalId(picture.id);
										setIsOpenEditModal(true);
									}
								}}
								selected={openEditModalId === picture.id && isOpenEditModal}
							>
								<span
									className={css`
										display: flex;
										justify-content: center;
										align-items: center;
									`}
								>
									<GoogleIcon name="edit" size={15} color="inherit" />
									<span
										className={css`
											line-height: 1;
											display: flex;
											font-size: 13px;
											color: inherit;
										`}
									>
										編集
									</span>
								</span>
							</Button>
						</div>
					</Modal>
					<EditPictureModal
						storeId={storeId}
						pictureId={picture.id}
						isOpen={userVerified === true && isOpenEditModal && openEditModalId === picture.id}
						setIsOpen={setIsOpenEditModal}
						callback={() => {
							setIsOpenEditModal(false);
							addMessage("写真を編集しました！", "success");
							getPictures(storeId);
							setIsViewPicture(false);
						}}
					/>
				</Fragment>
			))}
			<div
				className={css`
					display: flex;
					flex-direction: column;
					gap: 20px;
				`}
			>
				{(getPicturesStatus === "loading" || getPicturesStatus === "yet") && <LoadingCircleCenter />}
				{getPicturesStatus === "blocked" && (
					<div
						className={css`
							p {
								text-align: center;
							}
						`}
					>
						<p>API制限中</p>
						<p>時間を置いてからアクセスしてください。</p>
					</div>
				)}
				{getPicturesStatus === "successed" && getPicturesResponse !== undefined && (
					<>
						{getPicturesResponse.length === 0 && (
							<p
								className={css`
									text-align: center;
								`}
							>
								写真が無いようです😿
							</p>
						)}
						<section
							className={css`
								display: grid;
								grid-template-columns: 1fr 1fr 1fr;
								gap: 20px;
							`}
						>
							{[...getPicturesResponse].reverse().map((picture) => (
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
					</>
				)}
				{getPicturesStatus === "successed" && (
					<div
						className={css`
							position: sticky;
							bottom: 40px;
							text-align: right;
							z-index: 99;

							@media (max-width: 600px) {
								bottom: 20px;
							}
						`}
					>
						<Button
							onClick={() => {
								setIsOpenAddModal(true);
							}}
							disabled={userStatus === "loading"}
							loading={userStatus === "loading"}
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
