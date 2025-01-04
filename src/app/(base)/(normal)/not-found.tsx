import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "ページが見つかりませんでした"
};

export default function (): JSX.Element {
	return (
		<div>
			<p>ページが見つかりませんでした。</p>
			<p>- 404 Not Found -</p>
		</div>
	);
}
