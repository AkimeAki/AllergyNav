"use client";

import { css } from "@kuma-ui/core";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import ErrorMessage from "@/components/atoms/ErrorMessage";
import Button from "@/components/atoms/Button";
import AddMenuModal from "@/components/organisms/AddMenuModal";
import EditMenuModal from "@/components/organisms/EditMenuModal";
import { useGetMenus } from "@/hooks/useGetMenus";
import AllergenItem from "@/components/atoms/AllergenItem";
import Label from "@/components/atoms/Label";
import GoogleIcon from "@/components/atoms/GoogleIcon";
import MenuHistoryModal from "@/components/organisms/MenuHistoryModal";
import { formatText } from "@/libs/format-text";
import MiniTitle from "@/components/atoms/MiniTitle";
import useGetUserData from "@/hooks/useGetUserData";
import Modal from "@/components/molecules/Modal";
import SubTitle from "@/components/atoms/SubTitle";
import useSendVerifyMail from "@/hooks/useSendVerifyMail";
import Loading from "@/components/atoms/Loading";
import { useFloatMessage } from "@/hooks/useFloatMessage";
import useIsTouchDevice from "@/hooks/useIsTouchDevice";
import MiniModal from "@/components/molecules/MiniModal";
import MiniModalButton from "@/components/atoms/MiniModalButton";
import LoadingCircle from "@/components/atoms/LoadingCircle";

interface Props {
	id: string;
}

export default function ({ id }: Props): JSX.Element {
	const [isOpenAddModal, setIsOpenAddModal] = useState<boolean>(false);
	const [openEditModalId, setOpenEditModalId] = useState<string>();
	const [isOpenEditModal, setIsOpenEditModal] = useState<boolean>(false);
	const [openHistoryModalId, setOpenHistoryModalId] = useState<string>();
	const [isOpenHistoryModal, setIsOpenHistoryModal] = useState<boolean>(false);
	const [isOpenTouchMenuModal, setIsOpenTouchMenuModal] = useState<boolean>(false);
	const [openTouchMenuModalId, setOpenTouchMenuModalId] = useState<string>();
	const searchParams = useSearchParams();
	const { response: menus, message, getMenus } = useGetMenus();
	const [menuHoverId, setMenuHoverId] = useState<string>();
	const { status, userId, userVerified } = useGetUserData();
	const { sendVerifyMail, response: verifiedResponse, loading: sendVerifyLoading } = useSendVerifyMail();
	const { addMessage } = useFloatMessage();
	const { isTouch } = useIsTouchDevice();
	const params = {
		allergens: searchParams.get("allergens") ?? "",
		keywords: searchParams.get("keywords") ?? "",
		storeId: id
	};

	useEffect(() => {
		void getMenus(params.allergens, params.keywords, params.storeId);
	}, [searchParams]);

	return (
		<>
			<AddMenuModal
				storeId={id}
				isOpen={isOpenAddModal && status === "authenticated" && userVerified === true}
				setIsOpen={setIsOpenAddModal}
				callback={() => {
					setIsOpenAddModal(false);
					addMessage("メニューを追加しました！", "success", 3);
					void getMenus(params.allergens, params.keywords, params.storeId);
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
					メニューを追加するには、メール認証を完了する必要があります。
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
					メニューを追加するには、ログインする必要があります
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
			<Modal isOpen={isOpenEditModal && userVerified === false} setIsOpen={setIsOpenEditModal}>
				<SubTitle>メニューを編集</SubTitle>
				<p
					className={css`
						text-align: center;
						margin: 30px 0;
					`}
				>
					メニューを編集するには、メール認証を完了する必要があります。
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
			{menus?.map((item) => {
				return (
					<EditMenuModal
						key={item.id}
						menuId={item.id}
						isOpen={userVerified === true && isOpenEditModal && openEditModalId === item.id}
						setIsOpen={setIsOpenEditModal}
						callback={() => {
							setIsOpenEditModal(false);
							addMessage("メニューを編集しました！", "success", 3);
							void getMenus(params.allergens, params.keywords, params.storeId);
						}}
					/>
				);
			})}
			{menus?.map((item) => {
				return (
					<MenuHistoryModal
						key={item.id}
						menuId={item.id}
						isOpen={isOpenHistoryModal && openHistoryModalId === item.id}
						setIsOpen={setIsOpenHistoryModal}
					/>
				);
			})}
			<div
				className={css`
					display: flex;
					flex-direction: column;
					gap: 20px;
				`}
			>
				<section
					className={css`
						display: flex;
						flex-direction: column;
						gap: 20px;
					`}
				>
					{message !== undefined && message.type === "error" && <ErrorMessage>{message.text}</ErrorMessage>}
					{menus === undefined && <Loading />}
					{menus !== undefined && menus.length === 0 && (
						<p
							className={css`
								text-align: center;
							`}
						>
							メニューが無いようです😿
						</p>
					)}
					{[...(menus ?? [])].reverse().map((menu) => (
						<div
							key={menu.id}
							className={css`
								position: relative;
								transition-duration: 200ms;
								transition-property: box-shadow;
								overflow: hidden;
								border-radius: 7px;
								border-width: 2px;
								border-style: solid;
								border-color: #f3f3f3;

								&:hover {
									box-shadow: 0px 0px 15px -10px #777777;
								}
							`}
						>
							<MiniModal
								key={menu.id}
								isOpen={isOpenTouchMenuModal && openTouchMenuModalId === menu.id}
								setIsOpen={setIsOpenTouchMenuModal}
							>
								<div
									className={css`
										padding: 6px 0;
									`}
								>
									<MiniModalButton
										disabled={status !== "authenticated"}
										loading={status === "loading"}
										onClick={() => {
											if (status === "authenticated") {
												setOpenEditModalId(menu.id);
												setIsOpenEditModal(true);
												setIsOpenTouchMenuModal(false);
											} else if (status === "unauthenticated") {
												addMessage(
													"メニューを編集するには、ログインする必要があります",
													"error",
													3
												);
											}
										}}
									>
										編集
									</MiniModalButton>
									<MiniModalButton
										onClick={() => {
											setOpenHistoryModalId(menu.id);
											setIsOpenHistoryModal(true);
											setIsOpenTouchMenuModal(false);
										}}
									>
										履歴
									</MiniModalButton>
								</div>
							</MiniModal>
							<div
								className={css`
									position: relative;
									display: flex;
								`}
								onMouseEnter={() => {
									setMenuHoverId(menu.id);
								}}
								onMouseLeave={() => {
									setMenuHoverId(undefined);
								}}
							>
								{(menuHoverId === menu.id ||
									(openEditModalId === menu.id && isOpenEditModal) ||
									(openHistoryModalId === menu.id && isOpenHistoryModal)) &&
									!isTouch && (
										<div
											className={css`
												position: absolute;
												top: 5px;
												right: 5px;
												display: flex;
												gap: 5px;
												z-index: 99;
											`}
										>
											<Button
												size="tiny"
												disabled={status !== "authenticated"}
												onClick={() => {
													if (status === "authenticated") {
														setOpenEditModalId(menu.id);
														setIsOpenEditModal(true);
													}
												}}
												selected={openEditModalId === menu.id && isOpenEditModal}
											>
												<div
													className={css`
														position: relative;
													`}
												>
													{status !== "authenticated" && (
														<div
															className={css`
																position: absolute;
																top: 50%;
																left: 50%;
																transform: translate(-50%, -50%);
															`}
														>
															<LoadingCircle size={20} />
														</div>
													)}
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
												</div>
											</Button>
											<Button
												size="tiny"
												onClick={() => {
													setOpenHistoryModalId(menu.id);
													setIsOpenHistoryModal(true);
												}}
												selected={openHistoryModalId === menu.id && isOpenHistoryModal}
												color="var(--color-green)"
											>
												<span
													className={css`
														display: flex;
														justify-content: center;
														align-items: center;
													`}
												>
													<GoogleIcon name="history" size={15} color="inherit" />
													<span
														className={css`
															line-height: 1;
															display: flex;
															font-size: 13px;
															color: inherit;
														`}
													>
														履歴
													</span>
												</span>
											</Button>
										</div>
									)}
								{isTouch && (
									<div
										onClick={() => {
											setOpenTouchMenuModalId(menu.id);
											setIsOpenTouchMenuModal(true);
										}}
										className={css`
											position: absolute;
											top: 5px;
											right: 5px;
											z-index: 99;

											& > div {
												vertical-align: bottom;
											}
										`}
									>
										<GoogleIcon name="more_vert" size={23} color="var(--color-theme)" />
									</div>
								)}
								<Image
									className={css`
										aspect-ratio: 1/1;
										width: 100px;
									`}
									src="/no-image.png"
									width={100}
									height={100}
									alt="メニューの画像"
								/>
								<div
									className={css`
										padding: 10px;
										width: 100%;
										display: flex;
										flex-direction: column;
										gap: 20px;
									`}
								>
									<MiniTitle>{menu.name}</MiniTitle>
									{menu.allergens.length !== 0 && (
										<div
											className={css`
												display: flex;
												flex-direction: column;
												gap: 5px;
											`}
										>
											<div
												dangerouslySetInnerHTML={{
													__html: formatText(menu.description)
												}}
											/>
											<Label>含まれるアレルゲン</Label>
											<div
												className={css`
													display: flex;
													flex-wrap: wrap;
												`}
											>
												{menu.allergens.map((item) => {
													return (
														<AllergenItem
															key={item.id}
															image={`/icons/${item.id}.png`}
															text={item.name}
														/>
													);
												})}
											</div>
										</div>
									)}
								</div>
							</div>
						</div>
					))}
				</section>
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
							メニューを追加
						</Button>
					</div>
				)}
			</div>
		</>
	);
}
