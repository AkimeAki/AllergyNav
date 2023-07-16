import React from "react";
import AllergyItem from "@/components/atoms/AllergyItem";
import type { Allergy } from "@/definition";
import { allergyList } from "@/definition";
import css from "./AllergySelect.module.scss";

export default function AllergySelect(): JSX.Element {
	const [tags, setTags] = React.useState<string[]>([]);

	const clickAllergyItem = (id: Allergy, selected: boolean): void => {
		const currentTags = [...tags];
		if (selected) {
			const index = currentTags.indexOf(id);
			currentTags.splice(index, 1);
			setTags(currentTags);
		} else {
			setTags([...currentTags, id]);
		}
	};

	React.useEffect(() => {
		console.log(tags);
	}, [tags]);

	return (
		<div className={css.wrapper}>
			{Object.keys(allergyList).map((item) => {
				const allergy = item as Allergy;
				const selected = tags.some((tag) => tag === allergy);

				return (
					<AllergyItem
						key={allergy}
						image={allergyList[allergy].image}
						text={allergyList[allergy].name}
						onClick={() => {
							clickAllergyItem(allergy, selected);
						}}
						selected={selected}
					/>
				);
			})}
		</div>
	);
}
