import { getPortfolio } from '@/lib/data';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import F1ProgressBar from '@/components/site/F1ProgressBar';
import BackToTop from '@/components/site/BackToTop';
import RevealObserver from '@/components/site/RevealObserver';

export const revalidate = 60;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await getPortfolio();
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header name={profile.name} />
      <main id="main">{children}</main>
      <Footer profile={profile} />
      <F1ProgressBar />
      <BackToTop />
      <RevealObserver />
    </>
  );
}
