import nextra from 'nextra'

const withNextra = nextra({
    theme: 'nextra-theme-docs',
    themeConfig: './theme.config.tsx',
    latex: true,
    flexsearch: {
        codeblocks: false
    },
    defaultShowCopyCode: true,
    codeHighlight: true
})

export default withNextra({
    reactStrictMode: true,
    eslint: {
        // ESLint behaves weirdly in this monorepo.
        ignoreDuringBuilds: true
    }
})