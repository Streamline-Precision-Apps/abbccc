import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin(); 
/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'],
        
    }
};

export default withNextIntl(nextConfig);