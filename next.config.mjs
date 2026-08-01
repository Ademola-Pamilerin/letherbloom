// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     async headers() {
//         return [
//             {
//                 source: '/(.*)',
//                 headers: [
//                     {
//                         key: 'Cross-Origin-Embedder-Policy',
//                         value: 'require-corp',
//                     },
//                     {
//                         key: 'Cross-Origin-Opener-Policy',
//                         value: 'same-origin',
//                     },
//                 ],
//             },
//         ];
//     },
// };

// export default nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
            {
                source: "/live-training",
                headers: [
                    {
                        key: "Cross-Origin-Opener-Policy",
                        value: "same-origin",
                    },
                    {
                        key: "Cross-Origin-Embedder-Policy",
                        value: "require-corp",
                    },
                ],
            },
        ];
    },
};

export default nextConfig;