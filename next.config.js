/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: true,
    swcMinify: true,
}

module.exports = {
    webpack(config, { isServer }) {
        if (isServer) {
            // don’t try to bundle these—just require them at runtime
            config.externals.push('pdf-parse', 'mammoth')
        }
        return config
    },
    experimental: {
        // on Next 13.x, you also need:
        esmExternals: false
    }
}