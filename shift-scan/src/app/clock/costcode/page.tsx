
import React from 'react';
import  CostCodeFinder from '../../../../components/clock/costcodeFInder';

const HomePage: React.FC = () => {
  return (
    <div>
      < CostCodeFinder />
    </div>
  );
};

export default HomePage;

{/* <div className='flex flex-col items-center '> 
        <h1>{t('title')}</h1>
        <h2>{t('lN1') + scanResult?.data}</h2>
        <div className='flex-box p-5 justify-center'>
        <p>{t('lN2')}</p>
        
    
    </div>
    <div className='flex-box bg-blue-400 p-5 justify-center'>
        <Link href={'/clock/verify'}>{t('btn-next')}</Link>
    </div>
    </div> */}