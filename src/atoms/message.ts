import type { Message } from "@/type";
import { atom } from "recoil";

export const messagesState = atom<Message[]>({
	key: "messagesState",
	default: []
});

export const messagesToggleState = atom<boolean>({
	key: "messagesToggleState",
	default: false
});
