export { default } from 'next-auth/middleware'

export const config = { matcher: ['/src/app/:path*',
    '/app/:path*',
    '/clock/:path*',
    '/dashboard/:path*',
    '/login/:path*',
    '/:path*'

] }