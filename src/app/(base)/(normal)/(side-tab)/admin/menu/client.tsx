"use client";

import Button from "@/components/atoms/Button";
import LoadingCircleCenter from "@/components/atoms/LoadingCircleCenter";
import ListItem from "@/components/molecules/ListItem";
import ListWrapper from "@/components/molecules/ListWrapper";
import DeleteMenuModal from "@/components/organisms/modal/DeleteMenuModal";
import useGetMenus from "@/hooks/fetch-api/useGetMenus";
import { useFloatMessage } from "@/hooks/useFloatMessage";
import { GetMenusResponse } from "@/type";
import { css } from "@kuma-ui/core";
import { Fragment, useEffect, useState } from "react";

interface Props {
	menuList: NonNullable<GetMenusResponse>;
}

export default function ({ menuList }: Props): JSX.Element {
	const [openDeleteModalId, setOpenDeleteModalId] = useState<string>();
	const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);
	const { addMessage } = useFloatMessage();
	const [menus, setMenus] = useState<NonNullable<GetMenusResponse>>(menuList);
	const { getMenus, getMenusResponse, getMenusStatus } = useGetMenus("successed");

	useEffect(() => {
		if (getMenusStatus === "successed") {
			if (getMenusResponse !== undefined) {
				setMenus(getMenusResponse);
			}
		}
	}, [getMenusStatus, getMenusResponse]);

	return (
		<>
			{(getMenusStatus === "loading" || getMenusStatus === "yet") && <LoadingCircleCenter />}
			{getMenusStatus === "successed" && (
				<ListWrapper>
					{menus.map((menu) => (
						<Fragment key={menu.id}>
							<DeleteMenuModal
								key={menu.id}
								menuId={menu.id}
								isOpen={isOpenDeleteModal && openDeleteModalId === menu.id}
								setIsOpen={setIsOpenDeleteModal}
								callback={() => {
									setIsOpenDeleteModal(false);
									addMessage("メニューの削除を完了しました！", "success");
									getMenus("", "", "");
								}}
							/>
							<ListItem>
								<div
									className={css`
										display: flex;
										flex-direction: column;
										gap: 10px;
										padding: 5px;
									`}
								>
									<div
										className={css`
											display: flex;
											gap: 10px;
										`}
									>
										<span
											className={css`
												font-size: 14px;
												font-weight: bold;
											`}
										>
											ID:{menu.id}
										</span>
										<a
											href={`/store/${menu.store_id}`}
											target="_blank"
											className={css`
												font-size: 14px;
												font-weight: bold;
											`}
										>
											お店ID:{menu.store_id}
										</a>
									</div>
									<h3
										className={css`
											font-weight: bold;
										`}
									>
										{menu.name}
									</h3>
									<div>
										<Button
											size="tiny"
											color="var(--color-red)"
											onClick={() => {
												setOpenDeleteModalId(menu.id);
												setIsOpenDeleteModal(true);
											}}
										>
											削除
										</Button>
									</div>
								</div>
							</ListItem>
						</Fragment>
					))}
				</ListWrapper>
			)}
		</>
	);
}
