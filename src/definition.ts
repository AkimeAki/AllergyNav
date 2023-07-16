import EggImage from "@/assets/icons/egg.png";
import MilkImage from "@/assets/icons/milk.png";

export type Allergy =
	| "egg"
	| "milk"
	| "wheat"
	| "shrimp"
	| "crab"
	| "soba"
	| "peanut"
	| "walnut"
	| "abalone"
	| "squid"
	| "salmon"
	| "salmonRoe"
	| "orange"
	| "cashewNuts"
	| "kiwi"
	| "beef"
	| "sesame"
	| "mackerel"
	| "soy"
	| "chicken"
	| "banana"
	| "pork"
	| "matsutake"
	| "peach"
	| "yamaimo"
	| "apple"
	| "gelatin"
	| "almond"
	| "seafood";

export interface AllergyData {
	name: string;
	image: ImageMetadata;
}

type AllergyList = {
	[key in Allergy]: AllergyData;
};

export const allergyList: AllergyList = {
	egg: {
		name: "卵",
		image: EggImage
	},
	milk: {
		name: "乳製品",
		image: MilkImage
	},
	wheat: {
		name: "小麦",
		image: MilkImage
	},
	shrimp: {
		name: "エビ",
		image: MilkImage
	},
	crab: {
		name: "カニ",
		image: MilkImage
	},
	soba: {
		name: "そば",
		image: MilkImage
	},
	peanut: {
		name: "落花生",
		image: MilkImage
	},
	walnut: {
		name: "",
		image: MilkImage
	},
	abalone: {
		name: "小麦",
		image: MilkImage
	},
	squid: {
		name: "イカ",
		image: MilkImage
	},
	salmon: {
		name: "サケ",
		image: MilkImage
	},
	salmonRoe: {
		name: "いくら",
		image: MilkImage
	},
	orange: {
		name: "オレンジ",
		image: MilkImage
	},
	cashewNuts: {
		name: "カシューナッツ",
		image: MilkImage
	},
	kiwi: {
		name: "キウイ",
		image: MilkImage
	},
	beef: {
		name: "牛肉",
		image: MilkImage
	},
	sesame: {
		name: "ごま",
		image: MilkImage
	},
	mackerel: {
		name: "",
		image: MilkImage
	},
	soy: {
		name: "大豆",
		image: MilkImage
	},
	chicken: {
		name: "鶏肉",
		image: MilkImage
	},
	banana: {
		name: "バナナ",
		image: MilkImage
	},
	pork: {
		name: "豚肉",
		image: MilkImage
	},
	matsutake: {
		name: "松茸",
		image: MilkImage
	},
	peach: {
		name: "モモ",
		image: MilkImage
	},
	yamaimo: {
		name: "山芋",
		image: MilkImage
	},
	apple: {
		name: "リンゴ",
		image: MilkImage
	},
	gelatin: {
		name: "ゼラチン",
		image: MilkImage
	},
	almond: {
		name: "アーモンド",
		image: MilkImage
	},
	seafood: {
		name: "魚介類",
		image: MilkImage
	}
};
