import Link from "next/link";

export const metadata = {
  title: "Need Help",
};

export default function NeedHelpPage() {
  return (
    <div className="flex h-screen font-sans">
      {}
      <aside className="w-1/2 flex flex-col justify-center items-center text-justify relative bg-teal-500 font-sans rounded-r-2xl p-10">
        <div className="flex flex-col justify-center items-left text-left font-sans rounded-rs-2xl mt-37">
          <h1 className="text-8xl font-bold text-black mb-4">TODO.</h1>
          <hr className="w-full border-t-2 border-white my-4" />
          <h2 className="text-3xl font-semibold text-black mb-4">Need help with TaskFlow?</h2>
          <p className="text-xl text-white text-justify">
              We're here to help. Browse the FAQ, contact our support team, or send us a message and we'll respond as soon as possible.
          </p>
        </div>
        <div className="mt-auto w-full">
          <Link
            href="/register"
            className="inline-block mt-6 underline text-black font-semibold hover:text-black-900"
          >
            ← Back to Register
          </Link>
        </div>
      </aside>

      <main className="flex-1 flex flex-col bg-white p-8 overflow-y-auto">
        <div className="max-w-3xl w-full mx-auto">
          <header className="mb-6">
            <h1 className="text-3xl font-bold text-black text-center">Need help?</h1>
            <p className="text-center text-gray-600 mt-2">
              Find answers, contact support, or send a message — we're happy to assist.
            </p>
          </header>

          {/* FAQ */}
          <section className="mb-6">
            <h2 className="text-0.5xl font-semibold mb-3">Frequently asked questions</h2>
            <div className="space-y-3">
              <details className="p-4 border border-gray-100 rounded-lg">
                <summary className="cursor-pointer list-none font-medium text-gray-900">
                  1. How do I reset my password?
                </summary>
                <div className="mt-3 text-gray-700">
                  Go to <span className="font-medium">Settings → Account → Reset Password</span>.
                  <br/>
                  You'll receive a password reset link by email.
                </div>
              </details>

            <details className="p-4 border border-gray-100 rounded-lg">
                <summary className="cursor-pointer list-none font-medium text-gray-900">
                  2. How can I edit or delete a task?
                </summary>
                <div className="mt-3 text-gray-700">
                  Open your task list, tap or hover the task, then choose the edit ✏️ or delete 🗑️ action.
                  On mobile, long-press the task to reveal actions.
                </div>
            </details>

            <details className="p-4 border border-gray-100 rounded-lg">
                <summary className="cursor-pointer list-none font-medium text-gray-900">
                  3. How do I sync my tasks across devices?
                </summary>
                <div className="mt-3 text-gray-700">
                  Make sure you're logged in with the same account on each device. TaskFlow syncs
                  automatically via the cloud — allow background sync in device settings if available.
                </div>
            </details>

            <details className="p-4 border border-gray-100 rounded-lg">
                <summary className="cursor-pointer list-none font-medium text-gray-900">
                  4. Why am I not receiving notifications?
                </summary>
                <div className="mt-3 text-gray-700">
                  Check that notifications are enabled both in your device settings and under
                  TaskFlow → Settings → Notifications. Also confirm the task has a reminder set.
                </div>
            </details>

            <details className="p-4 border border-gray-100 rounded-lg">
                <summary className="cursor-pointer list-none font-medium text-gray-900">
                  5. How can I contact support?
                </summary>
                <div className="mt-3 text-gray-700">
                  Email us at{" "}
                  <a href="mailto:support@todo.lk" className="text-green-600 underline">
                    support@todo.lk
                  </a>
                  , or use the contact form below — we aim to reply within 24 hours.
                </div>
              </details>
          </div>
          </section>

            
          {/* Contact form */}
          <form className="mt-10 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Still Need Help?</h2>
          <p className="text-gray-600">Send us a message and we'll respond within 24 hours.</p>

          <input
            type="text"
            placeholder="Your Name"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <input
            type="email"
            placeholder="Your Email"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <textarea
            placeholder="Your Message"
            rows={4}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all"
          >
            Send Message
          </button>
          </form>


          <footer className="pt-6 border-t border-gray-100 text-sm text-gray-500">
            <p>Still need help?</p>
            <div className="mt-6 text-sm text-gray-600 space-y-1">
            <p>📧 <strong>Email:</strong> support@todo.lk</p>
            <p>📞 <strong>Phone:</strong> +94 71-0000000</p>
            <p>🕐 <strong>Hours:</strong> Mon-Fri, 9 AM-6 PM</p>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
