/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,

    // Emit a standalone build output for Docker
    output: 'standalone',

    webpack(config, { isServer }) {
        if (isServer) {
            // don’t try to bundle these—just require them at runtime
            config.externals.push('pdf-parse', 'mammoth');
        }
        return config;
    },

    experimental: {
        // on Next.js 13.x+, required for CJS externals
        esmExternals: false,
    },
};

module.exports = nextConfig;
