import {getTranslations} from 'next-intl/server';
import Link from 'next/link';
 
export default async function NotFoundPage() {
  const t = await getTranslations('common');
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">{t('notFound')}</h2>
      <p className="mb-4">{t('error')}</p>
      <Link 
        href="/"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        {t('goHome')}
      </Link>
    </div>
  );
}
