const { withKumaUI } = require("@kuma-ui/next-plugin");

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	experimental: {
		missingSuspenseWithCSRBailout: false
	}
};

module.exports = withKumaUI(nextConfig);
