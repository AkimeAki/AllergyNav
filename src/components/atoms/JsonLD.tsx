import { defaultDescription, siteTitle, siteUrl } from "@/definition";
import Script from "next/script";

interface Props {
	description?: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	jsonld?: any[];
}

export default function ({ description = defaultDescription, jsonld = [] }: Props) {
	const jsonldList =
		jsonld.length === 0
			? [
					{
						"@context": "https://schema.org",
						"@type": "WebSite",
						name: siteTitle,
						alternateName: siteTitle,
						description,
						url: siteUrl,
						potentialAction: {
							"@type": "SearchAction",
							target: {
								"@type": "EntryPoint",
								urlTemplate: `${siteUrl}/store?keywords={search_string}`
							},
							"query-input": "required name=search_string"
						},
						image: {
							"@type": "ImageObject",
							url: `${siteUrl}/icon512.png`,
							width: 512,
							height: 512
						}
					}
				]
			: jsonld;

	return (
		<>
			{jsonldList.map((json, index) => (
				<Script
					id={`jsonld-${index}`}
					key={index}
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
				/>
			))}
		</>
	);
}
