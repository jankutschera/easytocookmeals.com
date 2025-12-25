import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Data Deletion Request | Easy to Cook Meals",
  description: "Request deletion of your personal data from Easy to Cook Meals.",
};

export default function DataDeletionPage() {
  return (
    <div className="min-h-screen bg-parchment grain-texture">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <h1 className="text-4xl md:text-5xl font-display text-ink mb-8">
          Data Deletion Request
        </h1>

        <div className="prose prose-lg max-w-none font-body text-ink-light">
          <p className="text-xl mb-8">
            We respect your privacy and your right to control your personal data. This page explains how to request deletion of any data we may have collected about you.
          </p>

          <section className="bg-white rounded-organic p-8 shadow-warm border border-sand-200 mb-10">
            <h2 className="text-2xl font-display text-ink mb-4">What Data We Collect</h2>
            <p className="mb-4">Easy to Cook Meals collects minimal data:</p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Newsletter subscribers:</strong> Email address only</li>
              <li><strong>Recipe ratings:</strong> Anonymous ratings (no personal data)</li>
              <li><strong>Instagram integration:</strong> We only display our own content; no visitor data is collected</li>
            </ul>
          </section>

          <section className="bg-terracotta-50 rounded-organic p-8 border border-terracotta-200 mb-10">
            <h2 className="text-2xl font-display text-ink mb-4">How to Request Data Deletion</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-display text-ink mb-2">Option 1: Unsubscribe from Newsletter</h3>
                <p>
                  Click the "Unsubscribe" link at the bottom of any newsletter email. Your email address will be removed from our mailing list within 24 hours.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-display text-ink mb-2">Option 2: Email Request</h3>
                <p className="mb-2">
                  Send an email to{" "}
                  <a href="mailto:privacy@easytocookmeals.com" className="text-terracotta-600 hover:text-terracotta-700 underline font-medium">
                    privacy@easytocookmeals.com
                  </a>{" "}
                  with:
                </p>
                <ul className="list-disc pl-6">
                  <li>Subject: "Data Deletion Request"</li>
                  <li>The email address associated with your data</li>
                  <li>What data you want deleted (e.g., newsletter subscription)</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-display text-ink mb-4">Processing Time</h2>
            <p>
              We will process your data deletion request within <strong>30 days</strong> and send you a confirmation email once complete.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-display text-ink mb-4">Facebook/Instagram Data</h2>
            <p className="mb-4">
              If you connected to our website via Facebook or Instagram login (not currently supported, but for future reference):
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                You can revoke access in your{" "}
                <a
                  href="https://www.facebook.com/settings?tab=applications"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-terracotta-600 hover:text-terracotta-700 underline"
                >
                  Facebook App Settings
                </a>
              </li>
              <li>
                Or in your{" "}
                <a
                  href="https://www.instagram.com/accounts/manage_access/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-terracotta-600 hover:text-terracotta-700 underline"
                >
                  Instagram App Settings
                </a>
              </li>
            </ul>
            <p>
              Note: Our Instagram integration only displays our own public content and does not collect any visitor data.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-display text-ink mb-4">Contact</h2>
            <p>
              For any questions about data deletion or privacy, contact us at:{" "}
              <a href="mailto:privacy@easytocookmeals.com" className="text-terracotta-600 hover:text-terracotta-700 underline font-medium">
                privacy@easytocookmeals.com
              </a>
            </p>
          </section>

          <section className="text-center mt-12">
            <a
              href="/privacy"
              className="inline-flex items-center gap-2 text-terracotta-600 hover:text-terracotta-700 font-display"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Read our full Privacy Policy
            </a>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
