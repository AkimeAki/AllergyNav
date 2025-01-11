"use client";

import { css } from "@kuma-ui/core";
import SubTitle from "@/components/atoms/SubTitle";
import type { Dispatch, SetStateAction } from "react";
import { useEffect } from "react";
import Modal from "@/components/molecules/Modal";
import { useFloatMessage } from "@/hooks/useFloatMessage";
import Button from "@/components/atoms/Button";
import useDeleteMenu from "@/hooks/fetch-api/useDeleteMenu";

interface Props {
	menuId: string;
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	callback?: () => void;
}

export default function ({ menuId, isOpen, setIsOpen, callback }: Props): JSX.Element {
	const { deleteMenu, deleteMenuStatus } = useDeleteMenu();
	const { addMessage } = useFloatMessage();

	useEffect(() => {
		if (deleteMenuStatus === "successed") {
			addMessage("メニューの削除完了しました！", "success");
			if (callback !== undefined) {
				callback();
			}
		}

		if (deleteMenuStatus === "loading") {
			addMessage("送信しています", "success");
		}

		if (deleteMenuStatus === "failed") {
			addMessage("削除に失敗しました", "error");
		}
	}, [deleteMenuStatus]);

	return (
		<Modal isOpen={isOpen} setIsOpen={setIsOpen} close={deleteMenuStatus !== "loading"}>
			<SubTitle>メニューの削除申請</SubTitle>
			<form
				className={css`
					display: flex;
					flex-direction: column;
					gap: 20px;
					margin-top: 30px;

					& > div {
						display: flex;
						align-items: flex-start;
						flex-direction: column;
						gap: 10px;
					}
				`}
			>
				<div>
					<div
						className={css`
							width: 100%;
							text-align: right;
						`}
					>
						<Button
							onClick={() => {
								deleteMenu(menuId);
							}}
							disabled={deleteMenuStatus === "loading"}
							loading={deleteMenuStatus === "loading"}
						>
							削除する
						</Button>
					</div>
				</div>
			</form>
		</Modal>
	);
}
