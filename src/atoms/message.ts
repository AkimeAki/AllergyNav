import type { Message } from "@/type";
import { atom } from "recoil";

export const messagesState = atom<Message[]>({
	key: "messagesState",
	default: []
});

export const messagesSetToggleState = atom<boolean>({
	key: "messagesSetToggleState",
	default: false
});
