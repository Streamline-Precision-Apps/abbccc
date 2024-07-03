import { ReactNode } from 'react';
type Props = {
    children: ReactNode;
    TitleofContainer: string;
}
export const TitleContainer = ({ children, TitleofContainer }: Props) => {
    // const t = useTranslations('');
    return (
        <div className=' w-full '>
            <h1>{TitleofContainer}</h1>
            <div className='border-4 border-black p-5 w-full rounded-2xl mb-10 '>
            {children}
            </div>
        </div>
    );
};

