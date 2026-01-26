"use client";

import Link from "next/link";
import { useState, useRef } from "react";

// Placeholder logo URLs - replace with actual hosted logo URLs
const YAPI_LOGO_URL = "/images/yapi-logo.png";
const DOCTORLOGIC_LOGO_URL = "/images/doctorlogic-logo.png";

export default function SignatureCreator() {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [copiedGeneral, setCopiedGeneral] = useState(false);
  const [copiedReplies, setCopiedReplies] = useState(false);

  const generalSignatureRef = useRef<HTMLDivElement>(null);
  const repliesSignatureRef = useRef<HTMLDivElement>(null);

  const copyToClipboard = async (
    ref: React.RefObject<HTMLDivElement | null>,
    setCopied: (value: boolean) => void
  ) => {
    if (!ref.current) return;

    try {
      // Create a blob with the HTML content
      const html = ref.current.innerHTML;
      const blob = new Blob([html], { type: "text/html" });
      const plainText = ref.current.innerText;

      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": blob,
          "text/plain": new Blob([plainText], { type: "text/plain" }),
        }),
      ]);

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback to plain text copy
      const text = ref.current.innerText;
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isFormValid = name && title && email && phone;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/shared-tools/marketing"
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </Link>
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-orange-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Email Signature Creator
          </h1>
        </div>
        <p className="text-lg text-gray-600 mb-8">
          Create standardized email signatures for Yapi and DoctorLogic. Fill in
          your details below to generate both a general signature and a shorter
          version for replies.
        </p>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Input Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Your Details
            </h2>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Aaron Perreira"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="VP of Marketing, Yapi and DoctorLogic"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="aaron.perreira@yapicentral.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone *
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(555) 536-1212"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="meetingLink"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Meeting Scheduling Link{" "}
                  <span className="text-gray-400">(optional - for Sales)</span>
                </label>
                <input
                  type="url"
                  id="meetingLink"
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  placeholder="https://calendly.com/your-link"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
            <h2 className="text-xl font-semibold text-blue-900 mb-4">
              How to Use
            </h2>
            <ol className="space-y-3 text-blue-800">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-sm font-medium">
                  1
                </span>
                <span>Fill in your details in the form</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </span>
                <span>Preview your signatures below</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </span>
                <span>Click &quot;Copy&quot; to copy the HTML signature</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-sm font-medium">
                  4
                </span>
                <span>
                  Paste into your email client&apos;s signature settings
                </span>
              </li>
            </ol>

            <div className="mt-6 pt-4 border-t border-blue-200">
              <h3 className="font-medium text-blue-900 mb-2">Gmail</h3>
              <p className="text-sm text-blue-700">
                Settings → See all settings → General → Signature → Paste
              </p>
            </div>

            <div className="mt-4">
              <h3 className="font-medium text-blue-900 mb-2">Outlook</h3>
              <p className="text-sm text-blue-700">
                Settings → Mail → Compose and reply → Email signature → Paste
              </p>
            </div>
          </div>
        </div>

        {/* Signature Previews */}
        <div className="mt-12 space-y-8">
          {/* General Signature */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                General Signature
              </h2>
              <button
                onClick={() =>
                  copyToClipboard(generalSignatureRef, setCopiedGeneral)
                }
                disabled={!isFormValid}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  isFormValid
                    ? "bg-orange-600 text-white hover:bg-orange-700"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {copiedGeneral ? (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    Copy
                  </>
                )}
              </button>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div
                ref={generalSignatureRef}
                style={{ fontFamily: "Arial, sans-serif", fontSize: "14px" }}
              >
                {isFormValid ? (
                  <>
                    <p style={{ margin: "0 0 8px 0", color: "#333" }}>
                      Take care,
                      <br />
                      {name}
                    </p>
                    <p
                      style={{
                        margin: "16px 0",
                        color: "#999",
                        borderTop: "1px solid #ddd",
                        paddingTop: "16px",
                      }}
                    >
                      {/* Logo container */}
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "12px" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={YAPI_LOGO_URL}
                          alt="Yapi"
                          style={{ height: "32px", width: "auto" }}
                        />
                        <span style={{ color: "#ddd", fontSize: "24px" }}>|</span>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={DOCTORLOGIC_LOGO_URL}
                          alt="DoctorLogic"
                          style={{ height: "32px", width: "auto" }}
                        />
                      </span>
                    </p>
                    <p style={{ margin: "0", color: "#333" }}>
                      <strong>{name}</strong>
                      <br />
                      {title}
                      <br />
                      <a
                        href={`mailto:${email}`}
                        style={{ color: "#0066cc", textDecoration: "none" }}
                      >
                        {email}
                      </a>
                      <br />
                      {phone}
                      <br />
                      <a
                        href="https://www.yapiapp.com"
                        style={{ color: "#0066cc", textDecoration: "none" }}
                      >
                        www.yapiapp.com
                      </a>
                      <br />
                      <a
                        href="https://www.doctorlogic.com"
                        style={{ color: "#0066cc", textDecoration: "none" }}
                      >
                        www.doctorlogic.com
                      </a>
                      {meetingLink && (
                        <>
                          <br />
                          <a
                            href={meetingLink}
                            style={{ color: "#0066cc", textDecoration: "none" }}
                          >
                            Schedule a meeting
                          </a>
                        </>
                      )}
                    </p>
                  </>
                ) : (
                  <p className="text-gray-400 italic">
                    Fill in all required fields to preview your signature
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Replies Signature */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Replies Signature
              </h2>
              <button
                onClick={() =>
                  copyToClipboard(repliesSignatureRef, setCopiedReplies)
                }
                disabled={!isFormValid}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  isFormValid
                    ? "bg-orange-600 text-white hover:bg-orange-700"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {copiedReplies ? (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    Copy
                  </>
                )}
              </button>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div
                ref={repliesSignatureRef}
                style={{ fontFamily: "Arial, sans-serif", fontSize: "14px" }}
              >
                {isFormValid ? (
                  <>
                    <p style={{ margin: "0 0 8px 0", color: "#333" }}>
                      Take care,
                      <br />
                      {name}
                    </p>
                    <p
                      style={{
                        margin: "16px 0 0 0",
                        color: "#333",
                        borderTop: "1px solid #ddd",
                        paddingTop: "16px",
                      }}
                    >
                      <strong>{name}</strong>
                      <br />
                      {title}
                      <br />
                      <a
                        href={`mailto:${email}`}
                        style={{ color: "#0066cc", textDecoration: "none" }}
                      >
                        {email}
                      </a>
                      <br />
                      {phone}
                    </p>
                  </>
                ) : (
                  <p className="text-gray-400 italic">
                    Fill in all required fields to preview your signature
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
