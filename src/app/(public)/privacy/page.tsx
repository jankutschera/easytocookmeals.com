import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | Easy to Cook Meals",
  description: "Privacy Policy for Easy to Cook Meals - how we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-parchment grain-texture">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <h1 className="text-4xl md:text-5xl font-display text-ink mb-8">
          Privacy Policy
        </h1>

        <div className="prose prose-lg max-w-none font-body text-ink-light">
          <p className="text-xl text-ink-muted mb-8">
            Last updated: December 25, 2025
          </p>

          <section className="mb-10">
            <h2 className="text-2xl font-display text-ink mb-4">1. Introduction</h2>
            <p>
              Welcome to Easy to Cook Meals ("we," "our," or "us"). We are committed to protecting your privacy and personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website easytocookmeals.com.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-display text-ink mb-4">2. Information We Collect</h2>

            <h3 className="text-xl font-display text-ink mb-3">2.1 Information You Provide</h3>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Newsletter Subscription:</strong> Email address when you subscribe to our newsletter</li>
              <li><strong>Recipe Ratings:</strong> Anonymous ratings you submit for recipes</li>
              <li><strong>Contact Information:</strong> Any information you provide when contacting us</li>
            </ul>

            <h3 className="text-xl font-display text-ink mb-3">2.2 Automatically Collected Information</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Browser type and version</li>
              <li>Device information</li>
              <li>IP address (anonymized)</li>
              <li>Pages visited and time spent</li>
              <li>Referring website</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-display text-ink mb-4">3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Send you our newsletter (if subscribed)</li>
              <li>Improve our website and recipes</li>
              <li>Display aggregated recipe ratings</li>
              <li>Analyze website usage to improve user experience</li>
              <li>Respond to your inquiries</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-display text-ink mb-4">4. Third-Party Services</h2>
            <p>We use the following third-party services:</p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Vercel:</strong> Website hosting</li>
              <li><strong>Supabase:</strong> Database and authentication services</li>
              <li><strong>Instagram (Meta):</strong> To display our Instagram feed on the website</li>
            </ul>
            <p>
              Each of these services has their own privacy policy governing how they handle data.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-display text-ink mb-4">5. Instagram Integration</h2>
            <p>
              We use the Instagram Basic Display API to show our latest Instagram posts on our website. This integration:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Only displays publicly available content from our own Instagram account (@janshellskitchen)</li>
              <li>Does not collect any data from visitors</li>
              <li>Does not require visitors to log in to Instagram</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-display text-ink mb-4">6. Cookies</h2>
            <p>
              We use essential cookies to ensure the website functions properly. We do not use tracking cookies or third-party advertising cookies.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-display text-ink mb-4">7. Data Retention</h2>
            <p>
              We retain your personal data only for as long as necessary to fulfill the purposes outlined in this policy:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Newsletter subscriptions:</strong> Until you unsubscribe</li>
              <li><strong>Recipe ratings:</strong> Indefinitely (anonymous data)</li>
              <li><strong>Analytics data:</strong> 26 months</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-display text-ink mb-4">8. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Unsubscribe from our newsletter at any time</li>
              <li>Object to processing of your data</li>
            </ul>
            <p>
              To exercise any of these rights, please contact us at privacy@easytocookmeals.com.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-display text-ink mb-4">9. Data Deletion</h2>
            <p>
              To request deletion of your data, please visit our{" "}
              <a href="/data-deletion" className="text-terracotta-600 hover:text-terracotta-700 underline">
                Data Deletion page
              </a>{" "}
              or contact us at privacy@easytocookmeals.com.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-display text-ink mb-4">10. Children's Privacy</h2>
            <p>
              Our website is not intended for children under 16 years of age. We do not knowingly collect personal data from children.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-display text-ink mb-4">11. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-display text-ink mb-4">12. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <ul className="list-none pl-0 mt-4">
              <li><strong>Email:</strong> privacy@easytocookmeals.com</li>
              <li><strong>Website:</strong> easytocookmeals.com</li>
            </ul>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
