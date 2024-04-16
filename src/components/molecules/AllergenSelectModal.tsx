"use client";

import { css } from "@kuma-ui/core";
import type { Dispatch, SetStateAction } from "react";
import SubTitle from "@/components/atoms/SubTitle";
import BadAllergenSelect from "@/components/molecules/BadAllergenSelect";
import Button from "@/components/atoms/Button";
import useClickElemenetSet from "@/hooks/useClickElemenetSet";
import ModalBackground from "@/components/atoms/ModalBackground";

interface Props {
	selectAllergens: string[];
	setSelectAllergens: Dispatch<SetStateAction<string[]>>;
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	disabled?: boolean;
}

export default function ({
	selectAllergens,
	setSelectAllergens,
	isOpen,
	setIsOpen,
	disabled = false
}: Props): JSX.Element {
	const modalElement = useClickElemenetSet<HTMLDivElement>(() => {
		setIsOpen(false);
	}, [isOpen]);

	return (
		<div
			className={css`
				position: relative;
				width: 100%;
			`}
		>
			<Button
				onClick={() => {
					setIsOpen(true);
				}}
				size="small"
				selected={isOpen}
				disabled={disabled}
			>
				選択する
			</Button>
			{isOpen && (
				<>
					<ModalBackground color="transparent" />
					<div
						className={css`
							position: absolute;
							top: 0;
							left: 0;
							max-width: 100%;
							z-index: 99999;
							user-select: none;
							pointer-events: none;
						`}
					>
						<div
							ref={modalElement}
							className={css`
								background-color: var(--color-white);
								border-radius: 5px;
								padding: 20px;
								box-shadow: 0 0 20px -5px #969696;
								max-height: 100%;
								overflow-y: auto;
								user-select: text;
								pointer-events: auto;
							`}
						>
							<SubTitle>含まれるアレルゲン</SubTitle>
							<div
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
									<BadAllergenSelect
										selectAllergens={selectAllergens}
										setSelectAllergens={setSelectAllergens}
										position="left"
									/>
								</div>
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	);
}
