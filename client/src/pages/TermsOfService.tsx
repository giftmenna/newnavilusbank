import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import Footer from "@/components/layout/footer";
import { FileText, Briefcase, Scale, AlertCircle } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <section className="py-16 md:py-24 bg-gradient-to-b from-primary-50/50 to-white dark:from-gray-900 dark:to-gray-800">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
              <Scale className="h-12 w-12 text-primary-600 dark:text-primary-400 mb-4" />
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
                Terms of Service
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8">
                Welcome to Nivalus Bank! Please read our terms of service carefully.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-white dark:bg-gray-900">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="max-w-3xl mx-auto">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p>
                  Please read these Terms of Service ("Terms") carefully before using the Nivalus Bank website, mobile applications, and banking services (collectively, the "Services"). By accessing or using our Services, you agree to be bound by these Terms.
                </p>
                
                <h2 className="text-2xl font-bold mt-8 mb-4 flex items-center">
                  <Briefcase className="h-6 w-6 mr-2 text-primary-600 dark:text-primary-400" />
                  Acceptance of Terms
                </h2>
                <p>
                  By accessing or using our Services, you agree to these Terms and our Privacy Policy. If you do not agree to these Terms, you may not access or use our Services.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4 flex items-center">
                  <FileText className="h-6 w-6 mr-2 text-primary-600 dark:text-primary-400" />
                  Account Registration and Security
                </h2>
                <p>
                  To use certain features of our Services, you may need to register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
                </p>
                <p>
                  You are responsible for safeguarding your account credentials and for all activities that occur under your account. You agree to immediately notify us of any unauthorized use of your account or any other breach of security.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">Banking Services</h2>
                <p>
                  Nivalus Bank offers various banking services subject to applicable laws and regulations. Specific terms and conditions for individual banking products and services may be provided separately.
                </p>
                <p>
                  We reserve the right to modify, suspend, or discontinue any aspect of our Services at any time, including hours of operation or availability, without notice and without liability.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">Fees and Charges</h2>
                <p>
                  Fees and charges associated with our Services are disclosed in our fee schedules, account agreements, or other documentation provided to you. We reserve the right to change our fees and charges at any time, subject to applicable law and regulations.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4 flex items-center">
                  <AlertCircle className="h-6 w-6 mr-2 text-primary-600 dark:text-primary-400" />
                  Prohibited Activities
                </h2>
                <p>
                  You agree not to engage in any of the following prohibited activities:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Violating any applicable law, regulation, or these Terms</li>
                  <li>Using our Services for any illegal purpose</li>
                  <li>Attempting to interfere with or disrupt our Services or servers</li>
                  <li>Circumventing any security measures implemented by Nivalus Bank</li>
                  <li>Impersonating another person or entity</li>
                  <li>Using our Services to transmit any malware or viruses</li>
                  <li>Engaging in any activity that could damage, disable, or impair our Services</li>
                </ul>

                <h2 className="text-2xl font-bold mt-8 mb-4">Intellectual Property</h2>
                <p>
                  The Nivalus Bank name, logo, and all related names, logos, product and service names, designs, and slogans are trademarks of Nivalus Bank or its affiliates. You may not use such marks without our prior written permission.
                </p>
                <p>
                  All content, features, and functionality of our Services, including but not limited to text, graphics, logos, icons, images, audio clips, and software, are the exclusive property of Nivalus Bank and are protected by copyright, trademark, and other intellectual property laws.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">Limitation of Liability</h2>
                <p>
                  To the maximum extent permitted by applicable law, Nivalus Bank and its directors, officers, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, arising out of or in connection with your access to or use of our Services.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">Changes to These Terms</h2>
                <p>
                  We may revise these Terms from time to time. The most current version will always be posted on our website. If a revision, in our sole discretion, is material, we will notify you via email or through our Services. By continuing to access or use our Services after revisions become effective, you agree to be bound by the revised Terms.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">Governing Law</h2>
                <p>
                  These Terms and your use of our Services shall be governed by and construed in accordance with the laws of the state of New York, without giving effect to any choice or conflict of law provision or rule.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">Contact Information</h2>
                <p>
                  If you have any questions about these Terms, please contact us at:
                </p>
                <p className="mt-4">
                  <strong>Email:</strong> legal@nivalus.com<br />
                  <strong>Address:</strong> 123 Financial Street, New York, NY 10001<br />
                  <strong>Phone:</strong> (555) 123-4567
                </p>
              </div>

              <div className="mt-12 text-center">
                <Link href="/">
                  <Button variant="outline" size="lg" className="rounded-full px-8">
                    Return to Home
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}