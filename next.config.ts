/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "https://smart-robo-8u7x.vercel.app",
        TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || "8578256137:AAHZ89cc4wiMLnsZKMuU99BgusoQYCm0AG0",
        NEXTAUTH_URL: process.env.NEXTAUTH_URL || "https://smart-robo-8u7x.vercel.app",
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "6556e42b262f38c3be992a08c3ba5019",
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
