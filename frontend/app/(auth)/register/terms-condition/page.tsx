import Link from "next/link";

export const metadata = {
  title: "Terms & Conditions | TaskFlow",
};

export default function TermsAndConditionPage() {
  return (
    <div className="flex h-screen font-sans">
      {/*left*/}
      <div className="w-1/2 flex flex-col justify-center items-start text-left bg-teal-500 font-sans rounded-r-2xl p-10 relative">
        <h1 className="text-8xl font-bold text-black mb-4">TODO.</h1>
        <hr className="w-full border-t-2 border-white my-4" />
        <br/>
        <h2 className="text-3xl font-semibold text-black mb-4">Understand Our Terms &amp; Conditions</h2>
        <br/>
        <p className="text-xl text-white text-justify">
          Learn about how we manage your data, protect your privacy, and keep your TaskFlow
          experience secure and transparent.
        </p>
      </div>

      {/*right*/}
      <div className="flex-1 flex flex-col bg-white p-8 rounded-r-2xl overflow-y-auto">
        <div className="max-w-3xl w-full mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-black">Terms &amp; Conditions</h1>
          </div>

          <p className="text-gray-700 text-base mb-6">
            Welcome to <span className="font-semibold text-green-600">TaskFlow</span>.
            These Terms and Conditions govern your access to and use of our mobile and web
            applications, websites, and related services. By using our
            Service, you agree to be bound by these Terms.
          </p>

          <p className="text-gray-700 text-base mb-6">
            If you do not agree with these Terms, please do not use the Service.
          </p>

          <section className="space-y-6 text-gray-700 text-sm leading-relaxed mb-6">
            <div>
              <h2 className="font-semibold mb-2">1. Use of the Service</h2>
              <p>
                You must be at least 13 years old (or the minimum legal age in your country) to use the
                Service. You agree to use the Service only for lawful purposes and in accordance with
                these Terms. You are responsible for maintaining the confidentiality of your account
                credentials and for all activities that occur under your account.
              </p>
            </div>

            <div>
              <h2 className="font-semibold mb-2">2. User Accounts</h2>
              <p>
                To access certain features, you may need to create an account. You agree to provide
                accurate and complete information when creating an account. We reserve the right to
                suspend or terminate your account if we suspect any unauthorized or fraudulent activity.
              </p>
            </div>

            <div>
              <h2 className="font-semibold mb-2">3. User Content</h2>
              <p>
                You may add, edit, or delete tasks, notes, and other data within the App.
                You retain ownership of your User Content. However, by using the App, you grant us a
                limited, non-exclusive license to store, display, and process your data solely for operating
                the Service. You are responsible for ensuring your User Content complies with applicable
                laws and does not infringe upon the rights of others.
              </p>
            </div>

            <div>
              <h2 className="font-semibold mb-2">4. Data and Privacy</h2>
              <p>
                Your privacy is important to us. Please review our Privacy Policy to understand how we
                collect, use, and protect your information. We may collect certain data (such as app usage
                analytics) to improve the Service.
              </p>
            </div>

            <div>
              <h2 className="font-semibold mb-2">5. Subscription and Payments</h2>
              <p>
                (Include this section if your app has paid plans or premium features.) Some features of the
                Service may require a paid subscription. Subscription fees, billing cycles, and refund
                policies will be described within the App or on our website. We reserve the right to change
                prices or introduce new fees, with notice provided in advance.
              </p>
            </div>

            <div>
              <h2 className="font-semibold mb-2">6. Intellectual Property</h2>
              <p>
                All content, trademarks, logos, and software related to the Service (excluding User Content)
                are the property of [Your Company Name] or its licensors. You may not copy, modify,
                distribute, or create derivative works without our prior written consent.
              </p>
            </div>

            <div>
              <h2 className="font-semibold mb-2">7. Termination</h2>
              <p>
                We may suspend or terminate your access to the Service at any time, with or without notice,
                for conduct that violates these Terms or is otherwise harmful to the App or other users.
                Upon termination, your right to use the Service will immediately cease.
              </p>
            </div>

            <div>
              <h2 className="font-semibold mb-2">8. Limitation of Liability</h2>
              <p>
                The Service is provided on an “as is” and “as available” basis. We make no warranties,
                express or implied, regarding the reliability or availability of the Service. To the fullest
                extent permitted by law, [Your Company Name] shall not be liable for any indirect,
                incidental, or consequential damages arising from your use of the Service.
              </p>
            </div>

            <div>
              <h2 className="font-semibold mb-2">9. Changes to the Terms</h2>
              <p>
                We may update these Terms from time to time. Any changes will be posted in the App or on
                our website, with the “Last updated” date revised accordingly. Continued use of the Service
                after such updates constitutes your acceptance of the revised Terms.
              </p>
            </div>

            <div>
              <h2 className="font-semibold mb-2">10. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at:
              </p>
              <ul className="list-inside list-disc mt-2 text-sm text-gray-700">
                <li>✉️ Email: <a href="mailto:support@todo.lk" className="text-green-600 hover:underline">support@todo.lk</a></li>
                <li>📍 Address: Srilanka</li>
              </ul>
            </div>
          </section>

          <div className="mt-8 text-center">
            <Link href="/register" className="text-green-600 font-semibold hover:underline">
              ← Back to Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
