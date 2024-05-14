"use client";

import { css } from "@kuma-ui/core";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Button from "@/components/atoms/Button";
import AddMenuModal from "@/components/organisms/modal/AddMenuModal";
import EditMenuModal from "@/components/organisms/modal/EditMenuModal";
import AllergenItem from "@/components/atoms/AllergenItem";
import Label from "@/components/atoms/Label";
import GoogleIcon from "@/components/atoms/GoogleIcon";
import MenuHistoryModal from "@/components/organisms/modal/MenuHistoryModal";
import { formatText } from "@/libs/format-text";
import MiniTitle from "@/components/atoms/MiniTitle";
import useGetUserData from "@/hooks/useGetUserData";
import { useFloatMessage } from "@/hooks/useFloatMessage";
import useIsTouchDevice from "@/hooks/useIsTouchDevice";
import MiniModal from "@/components/molecules/MiniModal";
import MiniModalButton from "@/components/atoms/MiniModalButton";
import LoadingCircle from "@/components/atoms/LoadingCircle";
import useGetMenus from "@/hooks/fetch-api/useGetMenus";
import NotVerifiedModal from "@/components/molecules/NotVerifiedModal";
import NotLoginedModal from "@/components/molecules/NotLoginedModal";
import LoadingCircleCenter from "@/components/atoms/LoadingCircleCenter";
import useGetAllergens from "@/hooks/fetch-api/useGetAllergens";
import type { AllergenItemStatus } from "@/type";

interface Props {
	storeId: string;
}

export default function ({ storeId }: Props): JSX.Element {
	const [isOpenAddModal, setIsOpenAddModal] = useState<boolean>(false);
	const [openEditModalId, setOpenEditModalId] = useState<string>();
	const [isOpenEditModal, setIsOpenEditModal] = useState<boolean>(false);
	const [openHistoryModalId, setOpenHistoryModalId] = useState<string>();
	const [isOpenHistoryModal, setIsOpenHistoryModal] = useState<boolean>(false);
	const [isOpenTouchMenuModal, setIsOpenTouchMenuModal] = useState<boolean>(false);
	const [openTouchMenuModalId, setOpenTouchMenuModalId] = useState<string>();
	const searchParams = useSearchParams();
	const [menuHoverId, setMenuHoverId] = useState<string>();
	const { userStatus, userId, userVerified } = useGetUserData();
	const { getMenus, getMenusResponse, getMenusStatus } = useGetMenus();
	const { addMessage } = useFloatMessage();
	const { isTouch } = useIsTouchDevice();
	const { getAllergensResponse, getAllergens } = useGetAllergens();

	const params = {
		allergens: searchParams.get("allergens") ?? "",
		keywords: searchParams.get("keywords") ?? ""
	};

	useEffect(() => {
		getAllergens();
	}, []);

	useEffect(() => {
		getMenus(params.keywords, params.allergens, storeId);
	}, [searchParams]);

	return (
		<>
			<AddMenuModal
				storeId={storeId}
				isOpen={isOpenAddModal && userStatus === "authenticated" && userVerified === true}
				setIsOpen={setIsOpenAddModal}
				callback={() => {
					setIsOpenAddModal(false);
					addMessage("メニューを追加しました！", "success");
					getMenus(params.keywords, params.allergens, storeId);
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
			<NotVerifiedModal
				isOpen={isOpenEditModal && userVerified === false}
				setIsOpen={setIsOpenEditModal}
				userId={userId ?? ""}
			/>
			{getMenusResponse?.map((item) => {
				return (
					<EditMenuModal
						key={item.id}
						menuId={item.id}
						isOpen={userVerified === true && isOpenEditModal && openEditModalId === item.id}
						setIsOpen={setIsOpenEditModal}
						callback={() => {
							setIsOpenEditModal(false);
							addMessage("メニューを編集しました！", "success");
							getMenus(params.allergens, params.keywords, storeId);
						}}
					/>
				);
			})}
			{getMenusResponse?.map((item) => {
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
					{(getMenusStatus === "loading" || getMenusStatus === "yet") && <LoadingCircleCenter />}
					{getMenusStatus === "successed" && (
						<>
							{getMenusResponse?.length === 0 && (
								<p
									className={css`
										text-align: center;
									`}
								>
									メニューが無いようです😿
								</p>
							)}
							{[...(getMenusResponse ?? [])].reverse().map((menu) => (
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
												disabled={userStatus !== "authenticated"}
												loading={userStatus === "loading"}
												onClick={() => {
													if (userStatus === "authenticated") {
														setOpenEditModalId(menu.id);
														setIsOpenEditModal(true);
													} else if (userStatus === "unauthenticated") {
														addMessage(
															"メニューを編集するには、ログインする必要があります",
															"error",
															3
														);
													}
													setIsOpenTouchMenuModal(false);
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
														disabled={userStatus !== "authenticated"}
														onClick={() => {
															if (userStatus === "authenticated") {
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
															{userStatus !== "authenticated" && (
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
														color="var(--color-sub)"
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
											{Object.keys(menu.allergens).length !== 0 && (
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
														{getAllergensResponse?.map((allergen) => {
															let status: AllergenItemStatus = "unkown";
															if (menu.allergens[allergen.id] === "unkown") {
																status = "unkown";
															} else if (menu.allergens[allergen.id] === "contain") {
																status = "normal";
															} else if (
																menu.allergens[allergen.id] === "not contained"
															) {
																return "";
															} else if (menu.allergens[allergen.id] === "removable") {
																status = "check";
															}

															return (
																<AllergenItem
																	key={allergen.id}
																	image={`/icons/${allergen.id}.png`}
																	text={allergen.name}
																	status={status}
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
						</>
					)}
				</section>
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
						disabled={userStatus === "loading"}
						loading={userStatus === "loading"}
						onClick={() => {
							setIsOpenAddModal(true);
						}}
						selected={isOpenAddModal}
					>
						メニューを追加
					</Button>
				</div>
			</div>
		</>
	);
}
