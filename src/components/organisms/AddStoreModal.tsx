"use client";
import { css } from "@kuma-ui/core";
import SubTitle from "@/components/atoms/SubTitle";
import Label from "@/components/atoms/Label";
import TextInput from "@/components/atoms/TextInput";
import Select from "@/components/atoms/Select";
import TextArea from "@/components/atoms/TextArea";
import Button from "@/components/atoms/Button";
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import GoogleIcon from "@/components/atoms/GoogleIcon";
import type { StoreGroupList } from "@/type";
import Loading from "@/components/atoms/Loading";

interface Props {
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function ({ isOpen, setIsOpen }: Props): JSX.Element {
	const [storeName, setStoreName] = useState<string>("");
	const [storeAddress, setStoreAddress] = useState<string>("");
	const [storeDescription, setStoreDescription] = useState<string>("");
	const [enableSendButton, setEnableSendButton] = useState<boolean>(false);
	const [group, setStoreGroup] = useState<StoreGroupList>({
		id: null,
		name: null
	});
	const [selectGroupList, setSelectStoreGroupList] = useState<StoreGroupList[] | null>(null);
	const router = useRouter();
	const [isStoreSending, setIsStoreSending] = useState<boolean>(false);

	useEffect(() => {
		if (storeName !== "" && storeAddress !== "") {
			setEnableSendButton(true);
		} else {
			setEnableSendButton(false);
		}
	}, [storeName, storeAddress]);

	const addStore = async (): Promise<void> => {
		if (storeName === "" || storeAddress === "") {
			return;
		}

		setIsStoreSending(true);
		try {
			const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					name: storeName,
					address: storeAddress,
					description: storeDescription,
					group: group.id
				})
			});

			if (result.status !== 200) {
				throw new Error();
			}

			const response = await result.json();
			const id = response.id;
			router.push(`/store/${id}`);
		} catch (e) {
			setIsStoreSending(false);
		}
	};

	const getStoreGroupList = async (): Promise<void> => {
		try {
			// const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/group`, {
			// 	method: "GET",
			// 	headers: {
			// 		"Content-Type": "application/json"
			// 	}
			// });

			// const response = await result.json();
			// const groupList: StoreGroupList[] = [];
			// response.forEach((group: StoreGroup) => {
			// 	groupList.push({
			// 		id: group.id,
			// 		name: group.name
			// 	});
			// });
			setSelectStoreGroupList([]);
		} catch (e) {}
	};

	useEffect(() => {
		void getStoreGroupList();
	}, []);

	return (
		<>
			{isOpen && (
				<>
					<div
						onClick={() => {
							if (!isStoreSending) {
								setIsOpen(false);
							}
						}}
						className={css`
							position: fixed;
							top: 0;
							left: 0;
							width: 100%;
							height: 100%;
							background-color: #afafaf;
							z-index: 50000;
							filter: opacity(0.4);
						`}
					/>
					<div
						className={css`
							position: fixed;
							top: 50%;
							left: 50%;
							transform: translate(-50%, -50%);
							width: 100%;
							max-width: 800px;
							padding: 30px;
							z-index: 99999;
							user-select: none;
							pointer-events: none;
						`}
					>
						<div
							className={css`
								background-color: white;
								border-radius: 20px;
								padding: 20px;
								box-shadow: 0 0 20px -5px #969696;
								max-height: calc(100vh - 60px);
								overflow-y: auto;
								user-select: text;
								pointer-events: auto;
							`}
						>
							<SubTitle>お店を追加</SubTitle>
							<form
								className={css`
									display: flex;
									flex-direction: column;
									gap: 20px;
									margin-top: 30px;
									padding: 0 10px;

									& > div {
										display: flex;
										align-items: flex-start;
										flex-direction: column;
										gap: 10px;
									}
								`}
							>
								<div>
									<Label required>名前</Label>
									<TextInput
										disabled={isStoreSending}
										onChange={(e) => {
											setStoreName(e.target.value);
										}}
									/>
								</div>
								<div>
									<Label required>住所</Label>
									<TextInput
										disabled={isStoreSending}
										onChange={(e) => {
											setStoreAddress(e.target.value);
										}}
									/>
								</div>
								<div>
									<Label>グループ</Label>
									{selectGroupList !== null ? (
										<Select
											value={group.id === null ? "null" : String(group.id)}
											onChange={(e) => {
												setStoreGroup({
													id: isNaN(parseInt(e.target.value))
														? null
														: parseInt(e.target.value),
													name: null
												});
											}}
										>
											<option value="null">なし</option>
											{selectGroupList.map((group) => (
												<option key={group.id} value={String(group.id)}>
													{group.name}
												</option>
											))}
										</Select>
									) : (
										<Loading message="グループリスト取得中" />
									)}
								</div>
								<div>
									<Label>お店の詳細情報</Label>
									<TextArea
										value={storeDescription}
										disabled={isStoreSending}
										onChange={(e) => {
											setStoreDescription(e.target.value);
										}}
									/>
								</div>
								<div
									className={css`
										position: relative;
									`}
								>
									{!isStoreSending && (
										<div
											className={css`
												position: absolute;
												bottom: 0;
												left: 0;
												font-size: 0;
												cursor: pointer;
												user-select: none;
											`}
											onClick={() => {
												setIsOpen(false);
											}}
										>
											<GoogleIcon size={30} name="close" color="var(--color-black)" />
										</div>
									)}

									<div
										className={css`
											width: 100%;
											text-align: right;
										`}
									>
										<Button
											onClick={() => {
												void addStore();
											}}
											disabled={isStoreSending || !enableSendButton}
										>
											登録する
										</Button>
									</div>
								</div>
							</form>
						</div>
					</div>
				</>
			)}
		</>
	);
}
