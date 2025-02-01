"use client";

import { css } from "@kuma-ui/core";
import { useEffect, useState } from "react";
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
import type { AllergenItemStatus, GetMenusResponse } from "@/type";
import AlertBox from "@/components/atoms/AlertBox";
import useGetPictures from "@/hooks/fetch-api/useGetPictures";
import DeleteMenuRequestModal from "@/components/organisms/modal/DeleteMenuRequestModal";
import ListWrapper from "@/components/molecules/ListWrapper";
import ListItem from "@/components/molecules/ListItem";
import HeaderItemArea from "@/components/organisms/HeaderItemArea";
import Image from "next/image";

interface Props {
	storeId: string;
	menuList: NonNullable<GetMenusResponse>;
}

export default function ({ storeId, menuList }: Props): JSX.Element {
	const [isOpenAddModal, setIsOpenAddModal] = useState<boolean>(false);
	const [openEditModalId, setOpenEditModalId] = useState<string>();
	const [isOpenEditModal, setIsOpenEditModal] = useState<boolean>(false);
	const [openHistoryModalId, setOpenHistoryModalId] = useState<string>();
	const [isOpenHistoryModal, setIsOpenHistoryModal] = useState<boolean>(false);
	const [openDeleteRequestModalId, setOpenDeleteRequestModalId] = useState<string>();
	const [isOpenDeleteRequestModal, setIsOpenDeleteRequestModal] = useState<boolean>(false);
	const [isOpenTouchMenuModal, setIsOpenTouchMenuModal] = useState<boolean>(false);
	const [openTouchMenuModalId, setOpenTouchMenuModalId] = useState<string>();
	const [menuHoverId, setMenuHoverId] = useState<string>();
	const { userStatus, userId, userVerified } = useGetUserData();
	const { getMenus, getMenusResponse, getMenusStatus } = useGetMenus("successed");
	const { addMessage } = useFloatMessage();
	const { isTouch } = useIsTouchDevice();
	const { getAllergensStatus, getAllergensResponse, getAllergens } = useGetAllergens();
	const { getPicturesResponse, getPicturesStatus, getPictures } = useGetPictures();
	const [menus, setMenus] = useState<NonNullable<GetMenusResponse>>(menuList);

	useEffect(() => {
		getAllergens();
	}, []);

	useEffect(() => {
		if (getMenusStatus === "successed") {
			getPictures(storeId);

			if (getMenusResponse !== undefined) {
				setMenus(getMenusResponse);
			}
		}
	}, [getMenusStatus, getMenusResponse]);

	return (
		<>
			<AddMenuModal
				storeId={storeId}
				isOpen={isOpenAddModal && userStatus === "authenticated" && userVerified === true}
				setIsOpen={setIsOpenAddModal}
				callback={() => {
					setIsOpenAddModal(false);
					addMessage("メニューを追加しました！", "success");
					getMenus("", "", storeId);
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
			{menus.map((item) => {
				return (
					<EditMenuModal
						key={item.id}
						menuId={item.id}
						isOpen={userVerified === true && isOpenEditModal && openEditModalId === item.id}
						setIsOpen={setIsOpenEditModal}
						callback={() => {
							setIsOpenEditModal(false);
							addMessage("メニューを編集しました！", "success");
							getMenus("", "", storeId);
						}}
					/>
				);
			})}
			{menus.map((item) => {
				return (
					<MenuHistoryModal
						key={item.id}
						menuId={item.id}
						isOpen={isOpenHistoryModal && openHistoryModalId === item.id}
						setIsOpen={setIsOpenHistoryModal}
					/>
				);
			})}
			{menus.map((item) => {
				return (
					<DeleteMenuRequestModal
						key={item.id}
						menuId={item.id}
						isOpen={
							userVerified === true && isOpenDeleteRequestModal && openDeleteRequestModalId === item.id
						}
						setIsOpen={setIsOpenDeleteRequestModal}
						callback={() => {
							setIsOpenDeleteRequestModal(false);
							addMessage("メニューの削除申請を送信しました！", "success");
						}}
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
				<ListWrapper>
					{(getMenusStatus === "loading" || getMenusStatus === "yet") && <LoadingCircleCenter />}
					{getMenusStatus === "blocked" && (
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
					{getMenusStatus === "successed" && (
						<>
							{menus.length === 0 && (
								<p
									className={css`
										text-align: center;
									`}
								>
									メニューが無いようです😿
								</p>
							)}
							{menus.length !== 0 && (
								<AlertBox>
									<p
										className={css`
											text-align: center;
										`}
									>
										以下の情報はユーザーより提供いただいた情報で、
										<span
											className={css`
												font-weight: bold;
												text-decoration: underline;
												color: var(--color-red);
												margin: 0 5px;
											`}
										>
											公式情報ではありません
										</span>
										。間違った情報、古い情報が記載されている可能性もあるため、
										<span
											className={css`
												font-weight: bold;
												text-decoration: underline;
												color: var(--color-red);
												margin: 0 5px;
											`}
										>
											必ず実際の店舗でご確認のほどお願いいたします
										</span>
										。
									</p>
								</AlertBox>
							)}
							{[...menus].reverse().map((menu) => (
								<ListItem key={menu.id}>
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
											{userVerified === true && userStatus === "authenticated" && (
												<MiniModalButton
													onClick={() => {
														setOpenDeleteRequestModalId(menu.id);
														setIsOpenDeleteRequestModal(true);
														setIsOpenTouchMenuModal(false);
													}}
												>
													削除申請
												</MiniModalButton>
											)}
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

														--color-main: #6173ac;
														--color-sub: #61ac8c;
													`}
												>
													<Button
														size="tiny"
														disabled={userStatus !== "authenticated"}
														disabledClick
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
														}}
														selected={openEditModalId === menu.id && isOpenEditModal}
														color="var(--color-main)"
													>
														<div
															className={css`
																position: relative;
															`}
														>
															{userStatus === "loading" && (
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
													{userVerified === true && userStatus === "authenticated" && (
														<Button
															size="tiny"
															onClick={() => {
																setOpenDeleteRequestModalId(menu.id);
																setIsOpenDeleteRequestModal(true);
															}}
															selected={
																openDeleteRequestModalId === menu.id &&
																isOpenDeleteRequestModal
															}
															color="var(--color-red)"
														>
															<span
																className={css`
																	display: flex;
																	justify-content: center;
																	align-items: center;
																`}
															>
																<GoogleIcon name="delete" size={15} color="inherit" />
																<span
																	className={css`
																		line-height: 1;
																		display: flex;
																		font-size: 13px;
																		color: inherit;
																	`}
																>
																	削除申請
																</span>
															</span>
														</Button>
													)}
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
													top: 14px;
													right: 13px;
													z-index: 99;

													& > div {
														vertical-align: bottom;
													}
												`}
											>
												<GoogleIcon name="more_vert" size={23} color="white" />
											</div>
										)}
										<div
											className={css`
												position: relative;
												width: 150px;
												height: 150px;

												@media (max-width: 880px) {
													width: 100px;
													height: 100px;
												}
											`}
										>
											<div
												className={css`
													width: 100%;
													height: 100%;
													position: absolute;
													top: 0;
													left: 0;
													z-index: -1;
													background-color: #f5f5f5;

													@media (prefers-color-scheme: dark) {
														background-color: #555555;
													}
												`}
											/>
											{(() => {
												if (getPicturesStatus === "successed") {
													const imageUrl = getPicturesResponse?.find(
														(p) => p.menu_id === menu.id
													)?.url;

													if (imageUrl !== undefined) {
														if (imageUrl.endsWith(".jpg")) {
															return (
																<Image
																	className={css`
																		display: block;
																		width: 100%;
																		height: 100%;
																		object-fit: cover;

																		@media (max-width: 880px) {
																			object-fit: cover;
																		}
																	`}
																	src={imageUrl}
																	width={100}
																	height={100}
																	alt={menu.name}
																/>
															);
														}

														return (
															<img
																className={css`
																	display: block;
																	width: 100%;
																	height: 100%;
																	object-fit: cover;

																	@media (max-width: 880px) {
																		object-fit: cover;
																	}
																`}
																src={imageUrl}
																width={100}
																height={100}
																alt={menu.name}
															/>
														);
													}
												}

												return "";
											})()}
										</div>
										<div
											className={css`
												padding: 10px;
												width: 100%;
												display: flex;
												flex: 1;
												flex-direction: column;
												gap: 20px;
											`}
										>
											<MiniTitle>{menu.name}</MiniTitle>
											{formatText(menu.description) !== "" && (
												<div
													dangerouslySetInnerHTML={{
														__html: formatText(menu.description)
													}}
												/>
											)}
											{Object.keys(menu.allergens).length !== 0 && (
												<div
													className={css`
														display: flex;
														flex-direction: column;
														gap: 7px;

														@media (max-width: 880px) {
															display: none;
														}
													`}
												>
													<div
														className={css`
															display: flex;
															flex-direction: column;
															gap: 5px;
														`}
													>
														<Label>含まれるアレルゲン</Label>
														{(getAllergensStatus === "loading" ||
															getAllergensStatus === "yet") && <LoadingCircleCenter />}
														{getAllergensStatus === "blocked" && (
															<div
																className={css`
																	p {
																		text-align: center;
																		line-height: 1;
																	}
																`}
															>
																<p>API制限中</p>
																<p>時間を置いてからアクセスしてください。</p>
															</div>
														)}
														<div
															className={css`
																display: flex;
																flex-wrap: wrap;
																column-gap: 8px;
															`}
														>
															{getAllergensResponse?.map((allergen) => {
																let status: AllergenItemStatus = "unkown";
																if (menu.allergens[allergen.id] === "unkown") {
																	status = "unkown";
																} else if (menu.allergens[allergen.id] === "contain") {
																	status = "contain";
																} else if (
																	menu.allergens[allergen.id] === "not contained"
																) {
																	return "";
																} else if (
																	menu.allergens[allergen.id] === "removable"
																) {
																	status = "removable";
																}

																return (
																	<AllergenItem
																		key={allergen.id}
																		allergen={allergen.id}
																		text={allergen.name}
																		status={status}
																	/>
																);
															})}
														</div>
													</div>
													{getAllergensStatus === "successed" && (
														<div
															className={css`
																display: flex;
																gap: 5px;
																padding: 5px 4px;
																align-items: center;
																flex-wrap: wrap;

																* {
																	font-size: 13px;
																}
															`}
														>
															<span>含まれないアレルゲン：</span>
															<div
																className={css`
																	display: flex;
																	flex-wrap: wrap;
																	gap: 6px;
																`}
															>
																{(getAllergensResponse ?? []).filter((allergen) => {
																	return (
																		menu.allergens[allergen.id] === "not contained"
																	);
																}).length === 0 && <span>ありません。</span>}
																{getAllergensResponse?.map((allergen) => {
																	if (
																		menu.allergens[allergen.id] === "not contained"
																	) {
																		return (
																			<span
																				key={allergen.id}
																				className={css`
																					&:last-child {
																						span {
																							display: none;
																						}
																					}
																				`}
																			>
																				{allergen.name}
																				<span>,</span>
																			</span>
																		);
																	}

																	return "";
																})}
															</div>
														</div>
													)}
												</div>
											)}
										</div>
									</div>
									<div
										className={css`
											padding: 10px;
											display: none;
											gap: 7px;
											flex-direction: column;

											@media (max-width: 880px) {
												display: flex;
											}
										`}
									>
										<div
											className={css`
												display: flex;
												flex-direction: column;
												gap: 5px;
											`}
										>
											<Label>含まれるアレルゲン</Label>
											<div
												className={css`
													display: flex;
													flex-wrap: wrap;
													column-gap: 8px;
												`}
											>
												{getAllergensResponse?.map((allergen) => {
													let status: AllergenItemStatus = "unkown";
													if (menu.allergens[allergen.id] === "unkown") {
														status = "unkown";
													} else if (menu.allergens[allergen.id] === "contain") {
														status = "contain";
													} else if (menu.allergens[allergen.id] === "not contained") {
														return "";
													} else if (menu.allergens[allergen.id] === "removable") {
														status = "removable";
													}

													return (
														<AllergenItem
															key={allergen.id}
															allergen={allergen.id}
															text={allergen.name}
															status={status}
														/>
													);
												})}
											</div>
										</div>
										<div
											className={css`
												display: flex;
												gap: 5px;
												padding: 5px 4px;
												align-items: center;
												flex-wrap: wrap;

												* {
													font-size: 13px;
												}
											`}
										>
											<span>含まれないアレルゲン：</span>
											<div
												className={css`
													display: flex;
													flex-wrap: wrap;
													gap: 6px;
												`}
											>
												{(getAllergensResponse ?? []).filter((allergen) => {
													return menu.allergens[allergen.id] === "not contained";
												}).length === 0 && <span>ありません。</span>}
												{getAllergensResponse?.map((allergen) => {
													if (menu.allergens[allergen.id] === "not contained") {
														return (
															<span
																key={allergen.id}
																className={css`
																	&:last-child {
																		span {
																			display: none;
																		}
																	}
																`}
															>
																{allergen.name}
																<span>,</span>
															</span>
														);
													}

													return "";
												})}
											</div>
										</div>
									</div>
								</ListItem>
							))}
						</>
					)}
				</ListWrapper>
			</div>
			<HeaderItemArea>
				{getMenusStatus === "successed" && (
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
				)}
			</HeaderItemArea>
		</>
	);
}
