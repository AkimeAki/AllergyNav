import { messagesSetToggleState, messagesState } from "@/atoms/message";
import type { Message } from "@/type";
import { DefaultValue, selector } from "recoil";

export const messagesSelector = selector<Message>({
	key: "messagesSelector",
	get: ({ get }) => get(messagesState)[0],
	set: ({ set }, newValue) => {
		set(messagesState, (messages) => {
			if (!(newValue instanceof DefaultValue)) {
				set(messagesSetToggleState, (messagesSetToggle) => {
					return !messagesSetToggle;
				});

				const _messages = [...messages];
				_messages.push(newValue);
				return _messages;
			}

			return [];
		});
	}
});

export const messagesSetToggleSelector = selector({
	key: "messagesSetToggleSelector",
	get: () => {},
	set: ({ set }) => {
		set(messagesSetToggleState, (messagesSetToggle) => {
			return !messagesSetToggle;
		});
	}
});
