import { getPortfolio, siteUrl } from '@/lib/data';
import { listPosts } from '@/lib/blog';
import Hero from '@/components/site/Hero';
import Ticker from '@/components/site/Ticker';
import About from '@/components/site/About';
import Projects from '@/components/site/Projects';
import BlogSection from '@/components/site/BlogSection';
import Experience from '@/components/site/Experience';
import Skills from '@/components/site/Skills';
import Goals from '@/components/site/Goals';
import Contact from '@/components/site/Contact';

export const revalidate = 60;

export default async function Home() {
  const [data, posts] = await Promise.all([getPortfolio(), listPosts()]);
  const { profile } = data;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.title,
    description: profile.seoDescription,
    url: siteUrl(),
    image: profile.photo ? new URL(profile.photo, siteUrl()).toString() : undefined,
    email: profile.email ? `mailto:${profile.email}` : undefined,
    address: profile.location ? { '@type': 'PostalAddress', addressLocality: profile.location } : undefined,
    sameAs: [profile.linkedin, profile.github, profile.twitter, profile.instagram].filter(Boolean),
    alumniOf: data.education.filter((e) => /b\.?tech|university|college/i.test(e.school + e.degree)).map((e) => ({ '@type': 'CollegeOrUniversity', name: e.school })),
    knowsAbout: Array.from(new Set(data.skills.map((s) => s.category))),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <Hero data={data} />
      <Ticker skills={data.skills} />
      <About profile={profile} />
      <Projects projects={data.projects} />
      <BlogSection posts={posts} />
      <Experience experience={data.experience} education={data.education} achievements={data.achievements} />
      <Skills skills={data.skills} />
      <Goals goals={data.goals} />
      <Contact profile={profile} />
    </>
  );
}
