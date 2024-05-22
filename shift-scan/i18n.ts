import { getRequestConfig } from 'next-intl/server'

interface LocaleProps {
    locale: string
}

export default getRequestConfig(async ({ locale }: LocaleProps) => ({
    messages: (await import(`./messages/${locale}.json`)).default
}))