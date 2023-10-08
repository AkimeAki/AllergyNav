import type { Allergen } from "@/definition";
import type { Dispatch, SetStateAction } from "react";

interface ReturnType {
	clickAllergenItem: (id: Allergen, selected: boolean) => void;
}

export const allergenSelect = (tags: Allergen[], setTags: Dispatch<SetStateAction<Allergen[]>>): ReturnType => {
	const clickAllergenItem = (id: Allergen, selected: boolean): void => {
		const currentTags = [...tags];
		if (selected) {
			const index = currentTags.indexOf(id);
			currentTags.splice(index, 1);
			setTags(currentTags);
		} else {
			setTags([...currentTags, id]);
		}
	};

	return { clickAllergenItem };
};
