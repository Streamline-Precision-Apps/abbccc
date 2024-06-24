import { useTranslations } from 'next-intl';
import '@/app/globals.css';

const EmployeeButtons = () => {
    const t = useTranslations('EmployeeCards');
    return (
        <div className="grid grid-cols-2 grid-rows-3 gap-4 ">

            <button className="bg-orange-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 border border-gray-400  font-bold rounded"
            onClick={
                () => {
                    // <SwitchJobs />
                }
            }
            >{t('SwitchJobs')}</button>

            <button className="bg-green-300 hover:bg-gray-400 text-gray-800 font-semibold py-8 px-16 border border-gray-400  font-bold rounded"
            onClick={
                () => {
                    // <Equipment modal needed />
                }
            }
            >{t('Equipment')}</button>

            <button className="bg-blue-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 border border-gray-400  font-bold rounded"
            onClick={
                () => {
                    // < link to QR generator page />
                }
            }
            >{t('QrGenerator')}</button>

            <button className="bg-blue-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 border border-gray-400  font-bold rounded"
            onClick={
                () => {
                    // < link to my team page  />
                }
            }
            >{t('MyTeam')}</button>

            <button className="bg-red-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 border border-gray-400  font-bold rounded"
            onClick={
                () => {
                    // <modal for clock out needed />
                }
            }
            >
                {t('ClockOut')}
            </button>

            <button className="bg-blue-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 border border-gray-400  font-bold rounded"
            onClick={
                () => {
                    // < link to the Forms page />
                }
            }
            >{t('Forms')}</button>

        </div>

    )
}

export default EmployeeButtons