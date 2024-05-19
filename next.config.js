const { withKumaUI } = require("@kuma-ui/next-plugin");

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	experimental: {
		missingSuspenseWithCSRBailout: false
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "files.allergy-navi.com",
				port: "",
				pathname: "**"
			},
			{
				protocol: "https",
				hostname: process.env.FILES_HOSTNAME,
				port: "",
				pathname: "**"
			}
		]
	},
	webpack: (config) => {
		config.externals = [...config.externals, "bcrypt"];
		return config;
	}
};

module.exports = withKumaUI(nextConfig);
