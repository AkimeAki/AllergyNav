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
import Cursor from "@/components/atoms/Cursor";
import useAddStore from "@/hooks/fetch-api/useAddStore";
import { isEmptyString } from "@/libs/check-string";
import Modal from "@/components/molecules/Modal";
import { useFloatMessage } from "@/hooks/useFloatMessage";
import { normalize } from "@geolonia/normalize-japanese-addresses";
import { includePostCode } from "@/libs/check-address";

interface Props {
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function ({ isOpen, setIsOpen }: Props): JSX.Element {
	const [storeName, setStoreName] = useState<string>("");
	const [storeAddress, setStoreAddress] = useState<string>("");
	const [storeDescription, setStoreDescription] = useState<string>("");
	const [storeUrl, setStoreUrl] = useState<string>("");
	const [allergyMenuUrl, setAllergyMenuUrl] = useState<string>("");
	const [tabelogUrl, setTabelogUrl] = useState<string>("");
	const [gurunaviUrl, setGurunaviUrl] = useState<string>("");
	const [hotpepperUrl, setHotpepperUrl] = useState<string>("");
	const router = useRouter();
	const { addStoreResponse, addStoreStatus, addStore, addStoreReset } = useAddStore();
	const { addMessage } = useFloatMessage();
	const [isChanged, setIsChanged] = useState<boolean>(false);

	const addStoreClick = async (): Promise<void> => {
		if (includePostCode(storeAddress)) {
			addMessage("郵便番号は除外してください", "error");
			return;
		}

		const normalizeResult = await normalize(storeAddress);
		switch (normalizeResult.level) {
			case 0:
				addMessage("都道府県の識別ができません\n\nシステムに問題がある場合はお問い合わせください", "error");
				return;

			case 1:
				addMessage("市区町村の識別ができません\n\nシステムに問題がある場合はお問い合わせください", "error");
				return;

			case 2:
				addMessage("町丁目の識別ができません\n\nシステムに問題がある場合はお問い合わせください", "error");
				return;
		}

		if (
			normalizeResult.pref === undefined ||
			normalizeResult.city === undefined ||
			normalizeResult.town === undefined ||
			normalizeResult.addr === undefined
		) {
			addMessage("エラーが発生しました", "error");
			return;
		}

		const normalizedAddress =
			normalizeResult.pref + normalizeResult.city + normalizeResult.town + normalizeResult.addr;

		addStore(
			storeName,
			normalizedAddress,
			storeDescription,
			storeUrl,
			allergyMenuUrl,
			tabelogUrl,
			gurunaviUrl,
			hotpepperUrl
		);
	};

	useEffect(() => {
		if (addStoreStatus === "successed") {
			addMessage("お店を登録しました！", "success", "path");
			router.push(`/store/${addStoreResponse?.id ?? ""}`);
		}

		if (addStoreStatus === "loading") {
			addMessage("入力データを送信しています", "success");
		}

		if (addStoreStatus === "failed") {
			addMessage("お店の登録に失敗しました", "error");
		}
	}, [addStoreStatus]);

	useEffect(() => {
		if (
			!isEmptyString(storeName) ||
			!isEmptyString(storeAddress) ||
			!isEmptyString(storeDescription) ||
			!isEmptyString(storeUrl) ||
			!isEmptyString(allergyMenuUrl) ||
			!isEmptyString(tabelogUrl) ||
			!isEmptyString(gurunaviUrl) ||
			!isEmptyString(hotpepperUrl)
		) {
			setIsChanged(true);
		} else {
			setIsChanged(false);
		}
	}, [storeName, storeAddress, storeDescription, storeUrl, allergyMenuUrl, tabelogUrl, gurunaviUrl, hotpepperUrl]);

	useEffect(() => {
		if (!isOpen) {
			setStoreName("");
			setStoreAddress("");
			setStoreDescription("");
			setStoreUrl("");
			setAllergyMenuUrl("");
			setTabelogUrl("");
			setGurunaviUrl("");
			setHotpepperUrl("");
			addStoreReset();
		}
	}, [isOpen]);

	return (
		<>
			{addStoreStatus === "loading" && <Cursor cursor="wait" />}
			<Modal
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				close={addStoreStatus !== "loading" && addStoreStatus !== "successed"}
				onOutsideClick={
					isChanged
						? () => {
								const result = confirm("入力中のデータが消えますが、閉じても良いですか？");
								if (result) {
									setIsOpen(false);
								}
						  }
						: undefined
				}
			>
				<SubTitle>お店を追加</SubTitle>
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
						<Label required>お店の名前</Label>
						<TextInput
							value={storeName}
							disabled={addStoreStatus === "loading" || addStoreStatus === "successed"}
							loading={addStoreStatus === "loading" || addStoreStatus === "successed"}
							onChange={(e) => {
								setStoreName(e.target.value);
							}}
						/>
					</div>
					<div>
						<Label required>住所</Label>
						<p>郵便番号は除外してください。</p>
						<TextInput
							value={storeAddress}
							disabled={addStoreStatus === "loading" || addStoreStatus === "successed"}
							loading={addStoreStatus === "loading" || addStoreStatus === "successed"}
							onChange={(e) => {
								setStoreAddress(e.target.value);
							}}
						/>
					</div>
					<div>
						<Label>公式サイトURL</Label>
						<TextInput
							value={storeUrl}
							disabled={addStoreStatus === "loading" || addStoreStatus === "successed"}
							loading={addStoreStatus === "loading" || addStoreStatus === "successed"}
							onChange={(e) => {
								setStoreUrl(e.target.value);
							}}
						/>
					</div>
					<div>
						<Label>アレルギー成分表URL</Label>
						<p>
							アレルギー表がPDFで提供されている場合などは、更新されるごとにURLが変わる可能性があるため、URLに設定するのはおすすめしません。
						</p>
						<TextInput
							value={allergyMenuUrl}
							disabled={addStoreStatus === "loading" || addStoreStatus === "successed"}
							loading={addStoreStatus === "loading" || addStoreStatus === "successed"}
							onChange={(e) => {
								setAllergyMenuUrl(e.target.value);
							}}
						/>
					</div>
					<div>
						<Label>お店の詳細情報</Label>
						<TextArea
							value={storeDescription}
							disabled={addStoreStatus === "loading" || addStoreStatus === "successed"}
							loading={addStoreStatus === "loading" || addStoreStatus === "successed"}
							autoSize
							onChange={(e) => {
								setStoreDescription(e.target.value);
							}}
						/>
					</div>
					<div>
						<Label>食べログURL</Label>
						<TextInput
							value={tabelogUrl}
							disabled={addStoreStatus === "loading" || addStoreStatus === "successed"}
							loading={addStoreStatus === "loading" || addStoreStatus === "successed"}
							onChange={(e) => {
								setTabelogUrl(e.target.value);
							}}
						/>
					</div>
					<div>
						<Label>ぐるなびURL</Label>
						<TextInput
							value={gurunaviUrl}
							disabled={addStoreStatus === "loading" || addStoreStatus === "successed"}
							loading={addStoreStatus === "loading" || addStoreStatus === "successed"}
							onChange={(e) => {
								setGurunaviUrl(e.target.value);
							}}
						/>
					</div>
					<div>
						<Label>ホットペッパーグルメURL</Label>
						<TextInput
							value={hotpepperUrl}
							disabled={addStoreStatus === "loading" || addStoreStatus === "successed"}
							loading={addStoreStatus === "loading" || addStoreStatus === "successed"}
							onChange={(e) => {
								setHotpepperUrl(e.target.value);
							}}
						/>
					</div>
					<div>
						<div
							className={css`
								width: 100%;
								text-align: right;
							`}
						>
							<Button
								onClick={() => {
									void addStoreClick();
								}}
								disabled={
									addStoreStatus === "loading" ||
									addStoreStatus === "successed" ||
									isEmptyString(storeName) ||
									isEmptyString(storeAddress)
								}
								loading={addStoreStatus === "loading" || addStoreStatus === "successed"}
							>
								登録する
							</Button>
						</div>
					</div>
				</form>
			</Modal>
		</>
	);
}
