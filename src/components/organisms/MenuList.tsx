"use client";

import { css } from "@kuma-ui/core";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import ErrorMessage from "@/components/atoms/ErrorMessage";
import Loading from "@/components/atoms/Loading";
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
import { SessionProvider } from "next-auth/react";
import useGetUserData from "@/hooks/useGetUserData";

interface Props {
	id: string;
}

const MenuList = ({ id }: Props): JSX.Element => {
	const [isOpenAddModal, setIsOpenAddModal] = useState<boolean>(false);
	const [openEditModalId, setOpenEditModalId] = useState<string>();
	const [isOpenEditModal, setIsOpenEditModal] = useState<boolean>(false);
	const [openHistoryModalId, setOpenHistoryModalId] = useState<string>();
	const [isOpenHistoryModal, setIsOpenHistoryModal] = useState<boolean>(false);
	const searchParams = useSearchParams();
	const { status } = useGetUserData();
	const { response: menus, loading, message, getMenus } = useGetMenus();
	const [menuHoverId, setMenuHoverId] = useState<string>();
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
				isOpen={isOpenAddModal}
				setIsOpen={setIsOpenAddModal}
				reload={() => {
					void getMenus(params.allergens, params.keywords, params.storeId);
				}}
			/>
			{menus.map((item) => {
				return (
					<EditMenuModal
						key={item.id}
						menuId={item.id}
						isOpen={isOpenEditModal && openEditModalId === item.id}
						setIsOpen={setIsOpenEditModal}
						reload={() => {
							void getMenus(params.allergens, params.keywords, params.storeId);
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
			<div
				className={css`
					display: flex;
					flex-direction: column;
					gap: 20px;
					padding: 0 10px;
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
					{loading && <Loading />}
					{!loading && (
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
							{[...menus].reverse().map((menu) => (
								<div
									key={menu.id}
									className={css`
										transition-duration: 200ms;
										transition-property: box-shadow;
										overflow: hidden;
										border-radius: 7px;
										border-width: 2px;
										border-style: solid;
										border-color: #f3f3f3;
									`}
								>
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
											(openHistoryModalId === menu.id && isOpenHistoryModal)) && (
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
												{status === "authenticated" && (
													<Button
														size="tiny"
														onClick={() => {
															setOpenEditModalId(menu.id);
															setIsOpenEditModal(true);
														}}
														selected={openEditModalId === menu.id && isOpenEditModal}
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
												)}
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
						</>
					)}
				</section>
				<div
					className={css`
						position: sticky;
						bottom: 40px;
						text-align: right;
						z-index: 99;
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
			</div>
		</>
	);
};

export default function ({ id }: Props): JSX.Element {
	return (
		<SessionProvider>
			<MenuList id={id} />
		</SessionProvider>
	);
}
