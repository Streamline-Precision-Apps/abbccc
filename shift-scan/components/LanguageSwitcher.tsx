// components/LanguageSwitcher.tsx
"use client";
import { useRouter } from 'next/navigation';

const LanguageSwitcher: React.FC = () => {
  const router = useRouter();

  const changeLanguage = async (locale: string) => {
    await fetch(`/api/set-locale?locale=${locale}`);
    router.refresh(); // Refresh the page to apply the new locale
  };

  return (
    <div>
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('es')}>Spanish</button>
      {/* Add more languages as needed */}
    </div>
  );
};

export default LanguageSwitcher;