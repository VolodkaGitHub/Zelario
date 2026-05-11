import { Metadata } from "next";

export const metadata: Metadata = {
    title: {
        template: '%s | Zelario Docs',
        default: 'Documentation | Zelario Ecosystem',
    },
    description: "Deep dive into the architecture, tokenomics, and security protocols of the Zelario Web3 ecosystem.",
    keywords: ["Web3", "Blockchain", "DEX", "NFT", "Documentation", "Tokenomics", "Security"],
    openGraph: {
        title: 'Zelario Documentation',
        description: 'Master the unified Web3 ecosystem.',
        url: 'https://zelario.dex',
        siteName: 'Zelario',
        images: [
            {
                url: '/docs-og.png',
                width: 1200,
                height: 630,
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
};

export default function DocsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {children}
        </>
    );
}
