import { ArrowLeft } from 'lucide-react';
import { useMeta } from '../lib/useMeta';

export default function PrivacyPolicy() {
  useMeta({
    title: 'Privacy & Setting Policies | NexFrontier',
    description: 'NexFrontier Website Terms, Privacy & Cookies Notice - how we collect, use, and protect personal information.',
  });

  return (
    <div className="min-h-screen bg-nex-dark text-nex-text font-inter">
      {/* Header bar */}
      <header className="sticky top-0 z-40 bg-nex-darker/90 backdrop-blur border-b border-white/8">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <a
            href="/"
            className="flex items-center gap-1.5 text-nex-grey/70 text-sm hover:text-nex-cyan transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to NexFrontier
          </a>
          <span className="font-urbanist text-white font-bold text-base">
            Nex<span className="text-nex-cyan">Frontier</span>
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-14 pb-24">
        {/* Title block */}
        <div className="mb-12">
          <p className="text-nex-cyan text-xs font-semibold uppercase tracking-widest mb-3">Legal</p>
          <h1 id="page-heading" className="font-urbanist text-3xl md:text-4xl font-bold text-white mb-4">
            Website Terms, Privacy &amp; Cookies Notice
          </h1>
          <div className="flex flex-wrap gap-6 text-sm text-nex-grey/60">
            <span>Version: 1.0</span>
            <span>Effective Date: 1 May 2026</span>
          </div>
          <div className="mt-6 h-px bg-gradient-to-r from-nex-cyan/30 to-transparent" />
        </div>

        {/* Body */}
        <div className="space-y-10 text-nex-grey text-sm leading-relaxed">

          <Section id="s1" number="1" title="Purpose of This Notice">
            <p>This document explains:</p>
            <ul>
              <li>how NexFrontier collects, uses, stores, and protects personal information;</li>
              <li>how cookies and similar technologies may be used on this website;</li>
              <li>the terms on which visitors may use this website;</li>
              <li>how to contact us about privacy, cookies, or website use.</li>
            </ul>
            <p>
              NexFrontier operates across New Zealand and Malaysia. We aim to handle personal information in line with
              the New Zealand Privacy Act 2020, including its Information Privacy Principles, and Malaysia's Personal
              Data Protection Act 2010, including applicable amendments and guidance.
            </p>
          </Section>

          <PartHeading label="Part A" title="Privacy Notice" />

          <Section id="s2" number="2" title="Our Privacy Commitment">
            <p>
              NexFrontier helps organisations improve operational readiness, identify Quiet Loss, and recover value
              from demand that may otherwise be lost.
            </p>
            <p>We recognise that trust begins with how information is handled.</p>
            <p>We will:</p>
            <ul>
              <li>collect only information reasonably needed;</li>
              <li>explain why we collect it;</li>
              <li>use it only for legitimate and relevant purposes;</li>
              <li>protect it using reasonable safeguards;</li>
              <li>not sell personal information;</li>
              <li>not knowingly use customer information to train public artificial intelligence models;</li>
              <li>respect requests for access or correction where applicable.</li>
            </ul>
          </Section>

          <Section id="s3" number="3" title="Information We May Collect">
            <p>Depending on how you use our website or engage with us, we may collect:</p>
            <ul>
              <li>your name;</li>
              <li>business name;</li>
              <li>job title;</li>
              <li>email address;</li>
              <li>phone number;</li>
              <li>country or location;</li>
              <li>
                information you provide through enquiry forms, contact forms, audit requests, downloads, event
                registrations, or emails;
              </li>
              <li>website usage information;</li>
              <li>device, browser, and technical information;</li>
              <li>cookie and analytics information;</li>
              <li>information about the services or issues you wish to discuss with NexFrontier.</li>
            </ul>
            <p>
              We do not ask for sensitive personal information unless it is genuinely necessary for an agreed service
              or you choose to provide it.
            </p>
          </Section>

          <Section id="s4" number="4" title="How We Use Information">
            <p>We may use personal information to:</p>
            <ul>
              <li>respond to enquiries;</li>
              <li>arrange meetings, audits, briefings, or demonstrations;</li>
              <li>provide requested information, reports, or downloads;</li>
              <li>assess whether NexFrontier services may be relevant;</li>
              <li>deliver agreed services;</li>
              <li>manage customer relationships;</li>
              <li>improve our website, communications, services, and programme design;</li>
              <li>maintain security;</li>
              <li>meet legal, regulatory, or contractual obligations;</li>
              <li>send relevant business communications where permitted.</li>
            </ul>
            <p>We do not use personal information for unrelated purposes.</p>
          </Section>

          <Section id="s5" number="5" title="Why We Collect Information">
            <p>
              NexFrontier collects information only where it is reasonably necessary for a legitimate purpose
              connected with our business.
            </p>
            <p>This may include:</p>
            <ul>
              <li>responding to a request from you;</li>
              <li>providing a service;</li>
              <li>managing a business relationship;</li>
              <li>improving website performance;</li>
              <li>protecting our systems;</li>
              <li>meeting legal obligations.</li>
            </ul>
            <p>
              New Zealand privacy guidance states that organisations should collect only personal information
              necessary for a lawful purpose connected with their functions.
            </p>
          </Section>

          <Section id="s6" number="6" title="Marketing Communications">
            <p>
              Where permitted, NexFrontier may send business updates, invitations, thought leadership, programme
              information, or relevant service communications.
            </p>
            <p>You may opt out of marketing communications at any time by:</p>
            <ul>
              <li>using the unsubscribe link in an email; or</li>
              <li>contacting us at the address in section 28.</li>
            </ul>
            <p>
              Opting out of marketing will not stop us from sending necessary service, contractual, security, or
              administrative communications.
            </p>
          </Section>

          <Section id="s7" number="7" title="Sharing Information">
            <p>NexFrontier does not sell, rent, or trade personal information.</p>
            <p>We may share information only where reasonably necessary:</p>
            <ul>
              <li>with authorised employees, contractors, or delivery partners;</li>
              <li>
                with trusted service providers supporting our website, communications, hosting, analytics, or
                operations;
              </li>
              <li>where you have asked us to do so;</li>
              <li>where required or permitted by law;</li>
              <li>where necessary to protect NexFrontier, our customers, users, or systems.</li>
            </ul>
            <p>
              Any third party handling personal information for NexFrontier must be subject to appropriate
              confidentiality, privacy, and security expectations.
            </p>
          </Section>

          <Section id="s8" number="8" title="International Information Handling">
            <p>
              NexFrontier may use cloud platforms, service providers, or personnel located in New Zealand, Malaysia,
              or other countries.
            </p>
            <p>
              Where personal information is accessed, stored, or processed internationally, we will take reasonable
              steps to ensure appropriate safeguards are in place.
            </p>
            <p>
              If you are a customer with specific data residency, cross-border transfer, or security requirements,
              please raise these with us before providing information.
            </p>
          </Section>

          <Section id="s9" number="9" title="Security">
            <p>
              NexFrontier applies reasonable technical, organisational, and operational safeguards to protect
              information against unauthorised access, loss, misuse, disclosure, alteration, or destruction.
            </p>
            <p>Our practices may include:</p>
            <ul>
              <li>access controls;</li>
              <li>password protection;</li>
              <li>multi-factor authentication where appropriate;</li>
              <li>secure cloud systems;</li>
              <li>controlled file sharing;</li>
              <li>confidentiality obligations;</li>
              <li>access reviews;</li>
              <li>secure deletion or retention processes.</li>
            </ul>
            <p>
              No digital system is completely risk-free. However, we work to reduce risk and respond promptly if a
              concern arises.
            </p>
          </Section>

          <Section id="s10" number="10" title="Artificial Intelligence">
            <p>
              NexFrontier may use AI-assisted tools for analysis, research, documentation, reporting, workflow
              design, and operational insight.
            </p>
            <p>However:</p>
            <ul>
              <li>we do not knowingly use customer information to train public AI models;</li>
              <li>we do not intentionally place confidential customer information into public AI tools;</li>
              <li>material AI-supported outputs remain subject to human review;</li>
              <li>personal and sensitive information is minimised where possible;</li>
              <li>AI is used to support responsible business outcomes, not replace human accountability.</li>
            </ul>
            <p>
              More detailed information is available in NexFrontier's AI &amp; Data Usage Policy on request.
            </p>
          </Section>

          <Section id="s11" number="11" title="Retention">
            <p>We retain information only for as long as reasonably necessary to:</p>
            <ul>
              <li>respond to your enquiry;</li>
              <li>provide services;</li>
              <li>maintain business records;</li>
              <li>meet legal or contractual requirements;</li>
              <li>resolve disputes;</li>
              <li>maintain security;</li>
              <li>support legitimate operational improvement.</li>
            </ul>
            <p>
              When information is no longer needed, we aim to delete, anonymise, or securely archive it.
            </p>
          </Section>

          <Section id="s12" number="12" title="Your Rights">
            <p>Depending on applicable law, you may ask us to:</p>
            <ul>
              <li>confirm whether we hold personal information about you;</li>
              <li>provide access to that information;</li>
              <li>correct inaccurate information;</li>
              <li>update incomplete information;</li>
              <li>discuss how your information has been used;</li>
              <li>unsubscribe from marketing communications.</li>
            </ul>
            <p>To make a request, contact us at the address in section 28. We may need to verify your identity before responding.</p>
            <p>
              Under New Zealand privacy law, people generally have rights to access and correct personal information
              held about them.
            </p>
            <p>
              Malaysia's Personal Data Protection Act also provides individuals with rights relating to access and
              correction of personal data processed in commercial transactions.
            </p>
          </Section>

          <Section id="s13" number="13" title="Privacy Concerns or Complaints">
            <p>
              If you have a privacy concern, please contact us first via the contact details in section 28. We will
              aim to respond promptly and work constructively to resolve the issue.
            </p>
            <p>
              If you are based in New Zealand and remain dissatisfied, you may have the right to contact the Office
              of the Privacy Commissioner.
            </p>
            <p>
              If you are based in Malaysia and remain dissatisfied, you may have the right to contact the Personal
              Data Protection Commissioner.
            </p>
          </Section>

          <PartHeading label="Part B" title="Cookies Notice" />

          <Section id="s14" number="14" title="What Are Cookies?">
            <p>
              Cookies are small text files placed on your device by websites you visit. They are commonly used to
              help websites function, remember preferences, analyse traffic, and improve user experience.
            </p>
          </Section>

          <Section id="s15" number="15" title="How NexFrontier May Use Cookies">
            <p>NexFrontier may use cookies and similar technologies for:</p>
            <ul>
              <li>essential website functionality;</li>
              <li>remembering user preferences;</li>
              <li>website performance and security;</li>
              <li>analytics and measurement;</li>
              <li>understanding how visitors use our website;</li>
              <li>improving content, navigation, and user experience;</li>
              <li>marketing and advertising measurement, where enabled.</li>
            </ul>
          </Section>

          <Section id="s16" number="16" title="Types of Cookies We May Use">
            <SubHeading>Essential Cookies</SubHeading>
            <p>
              These are needed for core website functions, security, forms, session management, or preference
              settings. They cannot usually be disabled without affecting website functionality.
            </p>
            <SubHeading>Analytics Cookies</SubHeading>
            <p>
              These help us understand website traffic, visitor behaviour, page performance, and content engagement.
              Examples may include: Google Analytics, Google Tag Manager, Microsoft Clarity, Hotjar, Webflow
              Analytics, or other equivalent analytics tools.
            </p>
            <SubHeading>Functional Cookies</SubHeading>
            <p>
              These remember choices such as language, region, form settings, or preferences.
            </p>
            <SubHeading>Marketing Cookies</SubHeading>
            <p>
              These may be used to measure campaign performance, support advertising, or show more relevant
              information. Examples may include: LinkedIn Insight Tag, Meta Pixel, Google Ads, or other advertising
              or retargeting tools.
            </p>
            <p>NexFrontier will only list and use the tools actually installed on its website.</p>
          </Section>

          <Section id="s17" number="17" title="Managing Cookies">
            <p>You can manage cookies through:</p>
            <ul>
              <li>the cookie settings banner on this website, where available;</li>
              <li>your browser settings;</li>
              <li>third-party platform settings.</li>
            </ul>
            <p>
              Blocking some cookies may affect website functionality or limit how well the site works.
            </p>
          </Section>

          <Section id="s18" number="18" title="Cookies Used by Third Parties">
            <p>
              Some third-party services may place cookies on your device when you use our website. These may include
              analytics providers, embedded video platforms, calendar tools, CRM forms, chat tools, social
              platforms, or advertising platforms. Their use of cookies is governed by their own policies.
            </p>
            <p>
              NexFrontier does not control third-party cookie practices beyond the tools we choose to use on our
              website.
            </p>
          </Section>

          <PartHeading label="Part C" title="Website Terms of Use" />

          <Section id="s19" number="19" title="Acceptance of These Terms">
            <p>
              By using this website, you agree to these Website Terms, Privacy &amp; Cookies Notice. If you do not
              agree, please do not use the website.
            </p>
          </Section>

          <Section id="s20" number="20" title="General Information Only">
            <p>
              The content on this website is provided for general information, education, and discussion. It is not:
            </p>
            <ul>
              <li>legal advice;</li>
              <li>tax advice;</li>
              <li>accounting advice;</li>
              <li>financial advice;</li>
              <li>investment advice;</li>
              <li>employment advice;</li>
              <li>medical advice;</li>
              <li>regulated professional advice.</li>
            </ul>
            <p>
              You should obtain appropriate professional advice before making decisions based on website content.
            </p>
          </Section>

          <Section id="s21" number="21" title="No Guarantee of Outcomes">
            <p>
              NexFrontier may publish information about operational readiness, Quiet Loss, AI-mediated demand, The
              Brain, AMRI, customer journeys, or revenue recovery. This content is intended to inform discussion. It
              does not guarantee that:
            </p>
            <ul>
              <li>a particular business will achieve a particular recovery outcome;</li>
              <li>a service will be suitable for every organisation;</li>
              <li>a business will receive a particular amount of revenue;</li>
              <li>AI-mediated demand will develop in a particular way;</li>
              <li>The Brain will produce the same result in every operating environment.</li>
            </ul>
            <p>
              Results depend on many factors, including customer data, systems, people, market conditions,
              implementation, and leadership decisions.
            </p>
          </Section>

          <Section id="s22" number="22" title="Intellectual Property">
            <p>
              Unless otherwise stated, all content on this website is owned by or licensed to NexFrontier. This
              includes:
            </p>
            <ul>
              <li>text;</li>
              <li>design;</li>
              <li>graphics;</li>
              <li>logos;</li>
              <li>branding;</li>
              <li>frameworks;</li>
              <li>reports;</li>
              <li>methods;</li>
              <li>images;</li>
              <li>videos;</li>
              <li>downloads;</li>
              <li>The Brain;</li>
              <li>Quiet Loss;</li>
              <li>AMRI;</li>
              <li>website structure and content.</li>
            </ul>
            <p>
              You may view, download, or print website material for personal or internal business reference only.
              You must not copy, reproduce, publish, sell, modify, distribute, reverse engineer, or commercially
              exploit NexFrontier material without written permission.
            </p>
          </Section>

          <Section id="s23" number="23" title="Third-Party Links">
            <p>
              This website may link to third-party websites, tools, articles, or resources. These links are provided
              for convenience only. NexFrontier does not control, endorse, or accept responsibility for third-party
              content, services, privacy practices, availability, or security. Use third-party sites at your own
              discretion.
            </p>
          </Section>

          <Section id="s24" number="24" title="Website Availability and Changes">
            <p>
              NexFrontier may update, change, suspend, restrict, or remove any part of this website at any time. We
              do not guarantee that the website will always be available, error-free, secure, or current. We may
              update these Website Terms, Privacy &amp; Cookies Notice from time to time. The latest version will be
              published on this website.
            </p>
          </Section>

          <Section id="s25" number="25" title="Acceptable Use">
            <p>You must not use this website to:</p>
            <ul>
              <li>break the law;</li>
              <li>attempt unauthorised access;</li>
              <li>interfere with website operation;</li>
              <li>introduce harmful code;</li>
              <li>scrape, harvest, or misuse information;</li>
              <li>impersonate another person or organisation;</li>
              <li>submit misleading or fraudulent information;</li>
              <li>infringe NexFrontier or third-party rights;</li>
              <li>
                use the website in a way that could damage NexFrontier's reputation, systems, or customers.
              </li>
            </ul>
          </Section>

          <Section id="s26" number="26" title="Limitation of Liability">
            <p>
              To the maximum extent permitted by law, NexFrontier is not liable for loss, damage, cost, or expense
              arising from:
            </p>
            <ul>
              <li>reliance on website information;</li>
              <li>interruption or unavailability of the website;</li>
              <li>errors, omissions, or outdated content;</li>
              <li>third-party websites or services;</li>
              <li>viruses, malware, or security incidents beyond reasonable control;</li>
              <li>decisions made based on website content.</li>
            </ul>
            <p>Nothing in these terms excludes liability that cannot lawfully be excluded.</p>
          </Section>

          <Section id="s27" number="27" title="Governing Law">
            <p>
              These terms are governed by the laws of New Zealand, unless NexFrontier agrees otherwise in writing
              for a specific customer engagement. Where required by applicable law, rights available to users in
              Malaysia or other jurisdictions are not limited by this clause.
            </p>
          </Section>

          <Section id="s28" number="28" title="Contact">
            <p>For questions about this notice, cookies, privacy, website use, or permissions:</p>
            <div className="mt-4 grid sm:grid-cols-2 gap-4">
              <ContactCard
                entity="NexFrontier Group Sdn. Bhd"
                address={['Level 9, Menara Public Gold @ TRX,', 'No. 249, Jalan Tun Razak,', 'Kuala Lumpur 50400']}
                contacts={[{ role: 'Malaysia - Privacy Contact', name: 'Chris Stanley / Director', email: 'chris@nexfrontier.my' }]}
              />
              <ContactCard
                entity="NexFrontier Logic"
                address={['c/o Smarttax Solutions Ltd', 'Level 1/199 Lincoln Road,', 'Henderson, Auckland 0610']}
                contacts={[{ role: 'New Zealand - Privacy Contact', name: 'Sukesh Sukumaran / CEO', email: 'sukesh@nexfrontierlogic.com' }]}
              />
            </div>
          </Section>

          <Section id="s29" number="29" title="Summary">
            <p>NexFrontier will:</p>
            <ul>
              <li>collect only information reasonably needed;</li>
              <li>explain how we use it;</li>
              <li>protect it using reasonable safeguards;</li>
              <li>not sell it;</li>
              <li>not knowingly use it to train public AI models;</li>
              <li>give users a way to ask about access, correction, or privacy;</li>
              <li>use cookies transparently;</li>
              <li>provide website information for general purposes only;</li>
              <li>protect NexFrontier's intellectual property and website integrity.</li>
            </ul>
            <p className="text-nex-text font-medium mt-4">
              Trust is central to NexFrontier's work. This notice explains one part of how we earn it.
            </p>
          </Section>

        </div>
      </main>

      <footer className="border-t border-white/8 py-8 text-center font-inter text-nex-grey/40 text-xs">
        NexFrontier &copy; {new Date().getFullYear()} &middot; Version 1.0 &middot; Effective 1 May 2026
      </footer>
    </div>
  );
}

function PartHeading({ label, title }: { label: string; title: string }) {
  return (
    <div className="pt-4">
      <div className="inline-flex items-center gap-2 mb-2">
        <span className="text-nex-cyan text-xs font-semibold uppercase tracking-widest">{label}</span>
      </div>
      <h2 className="font-urbanist text-white text-xl font-bold border-b border-nex-cyan/20 pb-3">{title}</h2>
    </div>
  );
}

function Section({ id, number, title, children }: { id: string; number: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20">
      <h3 className="font-urbanist text-white font-semibold text-base mb-3">
        <span className="text-nex-cyan mr-2">{number}.</span>{title}
      </h3>
      <div className="space-y-3 pl-4 border-l border-white/6">{children}</div>
    </section>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return <p className="font-urbanist text-white/80 font-semibold text-sm mt-4 mb-1">{children}</p>;
}

function ContactCard({ entity, address, contacts }: {
  entity: string;
  address: string[];
  contacts: { role: string; name: string; email: string }[];
}) {
  return (
    <div className="bg-nex-darker border border-white/8 rounded-xl p-5 space-y-3">
      <p className="font-urbanist text-white font-semibold text-sm">{entity}</p>
      <div className="text-nex-grey/60 text-xs leading-relaxed">
        {address.map((line, i) => <p key={i}>{line}</p>)}
      </div>
      {contacts.map((c, i) => (
        <div key={i} className="pt-2 border-t border-white/6">
          <p className="text-nex-cyan/70 text-xs mb-0.5">{c.role}</p>
          <p className="text-white/80 text-xs">{c.name}</p>
          <a href={`mailto:${c.email}`} className="text-nex-cyan text-xs hover:underline">{c.email}</a>
        </div>
      ))}
    </div>
  );
}
