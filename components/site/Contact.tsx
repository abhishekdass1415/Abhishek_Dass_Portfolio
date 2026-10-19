import type { Profile } from '@/lib/types';
import ContactForm from './ContactForm';
import SectionHead from './SectionHead';
import Socials from './Socials';
import { Icon } from './Icon';

export default function Contact({ profile }: { profile: Profile }) {
  return (
    <section id="contact" className="section section-alt" aria-labelledby="contact-title">
      <div className="container">
        <SectionHead index="07" title="Contact" id="contact-title" kicker="// radio check" />
        <div className="contact-grid">
          <div className="contact-copy reveal">
            <p className="contact-big">Let&apos;s connect.</p>
            <p>
              Hiring for a motorsport data, software or AI role, or have a project in mind? Send a message and I will reply as soon as I can.
            </p>
            {profile.email && (
              <a className="contact-mail" href={`mailto:${profile.email}`}>
                <Icon name="mail" /> {profile.email}
              </a>
            )}
            {profile.location && (
              <p className="contact-loc mono">
                <Icon name="pin" size={16} /> {profile.location}
              </p>
            )}
            <Socials profile={profile} />
          </div>
          <div className="reveal">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
