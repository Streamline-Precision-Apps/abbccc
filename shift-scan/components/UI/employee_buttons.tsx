import {NextIntlClientProvider, useTranslations} from 'next-intl';
import { useLocale } from '../../components/localeContext';
import { LocaleProvider } from '../../components/localeContext';
import '../../src/app/globals.css';

const EmployeeButtons = () => {
    const locale  = useLocale();
    const t = useTranslations('EmployeeCards');
    return (
        <NextIntlClientProvider locale={locale} >
            <LocaleProvider>
        <div className="grid grid-cols-2 grid-rows-2 gap-4 ">

            <button className="bg-orange-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 border border-gray-400  font-bold rounded">{t('SwitchJobs')}</button>

            <button className="bg-green-300 hover:bg-gray-400 text-gray-800 font-semibold py-8 px-16 border border-gray-400  font-bold rounded">{t('Equipment')}</button>


            <button className="bg-red-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 border border-gray-400  font-bold rounded">{t('ClockOut')}</button>

            <button className="bg-blue-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 border border-gray-400  font-bold rounded">{t('Forms')}</button>

        </div>
        </LocaleProvider>
        </NextIntlClientProvider>
    )
}

export default EmployeeButtons