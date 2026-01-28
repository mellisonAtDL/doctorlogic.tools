import Link from "next/link";

export default function ArchitecturePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/engineering"
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
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              System Architecture
            </h1>
            <p className="text-gray-500">
              DoctorLogic Platform Technical Documentation
            </p>
          </div>
        </div>

        {/* Quick Nav - Diagram Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Link
            href="/engineering/architecture/diagrams/overview"
            className="p-4 bg-white rounded-xl border border-gray-200 hover:border-cyan-300 hover:shadow-md transition-all"
          >
            <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900">Platform Overview</h3>
            <p className="text-sm text-gray-500">High-level view</p>
          </Link>

          <Link
            href="/engineering/architecture/diagrams/value-flow"
            className="p-4 bg-white rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-md transition-all"
          >
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900">Value Flow</h3>
            <p className="text-sm text-gray-500">Customer journey</p>
          </Link>

          <Link
            href="/engineering/architecture/diagrams/infrastructure"
            className="p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all"
          >
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900">Infrastructure</h3>
            <p className="text-sm text-gray-500">Technical stack</p>
          </Link>

          <Link
            href="/engineering/architecture/diagrams/lead-flow"
            className="p-4 bg-white rounded-xl border border-gray-200 hover:border-amber-300 hover:shadow-md transition-all"
          >
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900">Lead Flow</h3>
            <p className="text-sm text-gray-500">How leads work</p>
          </Link>
        </div>

        {/* Documentation Content */}
        <div className="prose prose-gray max-w-none">
          {/* Overview Section */}
          <section className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mt-0 mb-4">
              What is DoctorLogic?
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              DoctorLogic is a <strong>multi-tenant B2B SaaS platform</strong> that builds and hosts
              marketing websites for healthcare practices. We help medical practices generate patient
              leads through optimized websites, content management, and lead capture.
            </p>

            <div className="grid md:grid-cols-3 gap-6 not-prose">
              <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-100">
                <div className="text-3xl font-bold text-cyan-600 mb-1">Websites</div>
                <div className="text-gray-600">Custom marketing websites for healthcare practices</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                <div className="text-3xl font-bold text-green-600 mb-1">Leads</div>
                <div className="text-gray-600">Form capture with instant notifications</div>
              </div>
              <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                <div className="text-3xl font-bold text-indigo-600 mb-1">Admin</div>
                <div className="text-gray-600">Management portal for practices & staff</div>
              </div>
            </div>
          </section>

          {/* Users Section */}
          <section className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mt-0 mb-6">
              Who Uses the Platform?
            </h2>

            <div className="overflow-x-auto not-prose">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-4 font-semibold text-gray-900">User Type</th>
                    <th className="py-3 px-4 font-semibold text-gray-900">Description</th>
                    <th className="py-3 px-4 font-semibold text-gray-900">Access</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600">
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Website Viewer</td>
                    <td className="py-3 px-4">Potential patient browsing a client&apos;s practice website</td>
                    <td className="py-3 px-4"><code className="text-sm bg-gray-100 px-2 py-0.5 rounded">www.clientpractice.com</code></td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Client</td>
                    <td className="py-3 px-4">Practice staff/owner - our paying customer. Views leads, manages basic content.</td>
                    <td className="py-3 px-4"><code className="text-sm bg-gray-100 px-2 py-0.5 rounded">admin.doctorlogic.com</code> (limited)</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">DL Employee</td>
                    <td className="py-3 px-4">Internal team - builds sites, manages clients, full platform access.</td>
                    <td className="py-3 px-4"><code className="text-sm bg-gray-100 px-2 py-0.5 rounded">admin.doctorlogic.com</code> (full + internal features)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Designer</td>
                    <td className="py-3 px-4">Design team - works directly in website code/templates. Non-branching workflow.</td>
                    <td className="py-3 px-4">Code access to Websites project</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Application Architecture */}
          <section className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mt-0 mb-6">
              The Application (One Repo)
            </h2>

            <p className="text-gray-600 mb-6">
              The main application is an <strong>ASP.NET monolith</strong> that has evolved over the years.
              It&apos;s a mix of ASP.NET MVC, Web Forms, Web API, jQuery, and React (for newer admin features).
              All code lives in a single repository with three main projects:
            </p>

            <div className="grid md:grid-cols-3 gap-4 not-prose mb-6">
              <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                <h3 className="font-bold text-indigo-800 mb-2">Admin Project</h3>
                <div className="text-sm text-gray-600 mb-2">
                  <code className="bg-white px-2 py-0.5 rounded text-indigo-600">admin.doctorlogic.com</code>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Client admin (limited features)</li>
                  <li>• Internal admin (full features)</li>
                  <li>• Role-based access controls</li>
                  <li>• React components (newer UI)</li>
                </ul>
              </div>

              <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
                <h3 className="font-bold text-cyan-800 mb-2">Websites Project</h3>
                <div className="text-sm text-gray-600 mb-2">
                  <code className="bg-white px-2 py-0.5 rounded text-cyan-600">www.clientname.com</code>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Serves all client websites</li>
                  <li>• Multi-tenant: hostname → siteId</li>
                  <li>• Full custom domains</li>
                  <li>• Templates & content rendering</li>
                </ul>
              </div>

              <div className="bg-gray-100 rounded-lg p-4 border border-gray-200">
                <h3 className="font-bold text-gray-800 mb-2">Core Project</h3>
                <div className="text-sm text-gray-600 mb-2">
                  <code className="bg-white px-2 py-0.5 rounded text-gray-600">Shared Library</code>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Data access layer</li>
                  <li>• Business logic</li>
                  <li>• Shared models</li>
                  <li>• Common utilities</li>
                </ul>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 not-prose">
              <div className="flex gap-3">
                <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <div className="font-medium text-amber-800">Tech Stack Mix</div>
                  <div className="text-sm text-amber-700">ASP.NET MVC, Web Forms, Web API, jQuery, React (newer features). The codebase has evolved over years with incremental modernization.</div>
                </div>
              </div>
            </div>
          </section>

          {/* Infrastructure Section */}
          <section className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mt-0 mb-6">
              Infrastructure (All Azure)
            </h2>

            <div className="space-y-6 not-prose">
              {/* Edge */}
              <div>
                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center text-orange-600 text-sm font-bold">1</span>
                  Edge Layer
                </h3>
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-100 ml-10">
                  <div className="font-medium text-orange-800">Cloudflare Enterprise</div>
                  <div className="text-sm text-gray-600">CDN with &quot;cache everything&quot; enabled, WAF, DNS management, custom domain handling. Some Cloudflare Workers for ad-hoc client customizations.</div>
                </div>
              </div>

              {/* Load Balancing */}
              <div>
                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center text-blue-600 text-sm font-bold">2</span>
                  Load Balancing
                </h3>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 ml-10">
                  <div className="font-medium text-blue-800">Azure Load Balancer</div>
                  <div className="text-sm text-gray-600">Distributes traffic across the production web servers.</div>
                </div>
              </div>

              {/* Compute */}
              <div>
                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 bg-indigo-100 rounded flex items-center justify-center text-indigo-600 text-sm font-bold">3</span>
                  Compute Layer (VMs)
                </h3>
                <div className="grid md:grid-cols-2 gap-3 ml-10">
                  <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                    <div className="font-medium text-indigo-800">4 Production Web Servers</div>
                    <div className="text-sm text-gray-600">Windows Server + IIS running the ASP.NET application</div>
                  </div>
                  <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                    <div className="font-medium text-indigo-800">1 Dev/Test Server</div>
                    <div className="text-sm text-gray-600">Development and testing environment</div>
                  </div>
                  <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                    <div className="font-medium text-indigo-800">Asset Server</div>
                    <div className="text-sm text-gray-600"><code className="bg-white px-1 rounded">assets.doctorlogic.com</code> - Images/media uploaded by DL team</div>
                  </div>
                </div>
              </div>

              {/* Data */}
              <div>
                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 bg-amber-100 rounded flex items-center justify-center text-amber-600 text-sm font-bold">4</span>
                  Data Layer
                </h3>
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-100 ml-10">
                  <div className="font-medium text-amber-800">SQL Server (Primary + Backup VMs)</div>
                  <div className="text-sm text-gray-600 mb-2">Single multi-tenant database - all clients&apos; data in one DB, separated by siteId.</div>
                  <div className="text-sm text-gray-600"><strong>Database Mail:</strong> Configured to send emails via SendGrid relay for lead notifications.</div>
                </div>
              </div>

              {/* Background Processing */}
              <div>
                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center text-purple-600 text-sm font-bold">5</span>
                  Background Processing
                </h3>
                <div className="grid md:grid-cols-3 gap-3 ml-10">
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                    <div className="font-medium text-purple-800">Azure Functions</div>
                    <div className="text-sm text-gray-600">Various background processing jobs, data fetching</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                    <div className="font-medium text-purple-800">SSIS</div>
                    <div className="text-sm text-gray-600">SQL Server Integration Services - ETL jobs, BrightLocal data sync</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                    <div className="font-medium text-purple-800">DAPI</div>
                    <div className="text-sm text-gray-600">Custom data job system (database + Azure Function hybrid)</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* External Services */}
          <section className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mt-0 mb-6">
              External Services & Integrations
            </h2>

            <div className="overflow-x-auto not-prose">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-4 font-semibold text-gray-900">Service</th>
                    <th className="py-3 px-4 font-semibold text-gray-900">Purpose</th>
                    <th className="py-3 px-4 font-semibold text-gray-900">Integration</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600">
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">SendGrid</td>
                    <td className="py-3 px-4">Email delivery - lead notifications, system emails</td>
                    <td className="py-3 px-4">Via SQL Server Database Mail</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Google Auth</td>
                    <td className="py-3 px-4">Authentication for admin users</td>
                    <td className="py-3 px-4">OAuth integration</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Google Analytics</td>
                    <td className="py-3 px-4">Client-configured GA4, data pulled into admin</td>
                    <td className="py-3 px-4">Backend job fetches via GA4 API</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">BrightLocal</td>
                    <td className="py-3 px-4">Reviews and reputation management</td>
                    <td className="py-3 px-4">Data synced via SSIS jobs</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">OpenAI</td>
                    <td className="py-3 px-4">AI features in admin (minor usage)</td>
                    <td className="py-3 px-4">API integration</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">CTM</td>
                    <td className="py-3 px-4">CallTrackingMetrics - call tracking</td>
                    <td className="py-3 px-4">Optional add-on service</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Webhooks</td>
                    <td className="py-3 px-4">Push leads to client CRMs</td>
                    <td className="py-3 px-4">Configurable per-client</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Key Flows */}
          <section className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mt-0 mb-6">
              Key Data Flows
            </h2>

            <div className="space-y-6 not-prose">
              {/* Lead Flow */}
              <div className="bg-green-50 rounded-lg p-5 border border-green-200">
                <h3 className="font-bold text-green-800 mb-3">Lead Capture Flow</h3>
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="bg-white px-3 py-1 rounded border border-green-200">Patient visits site</span>
                  <span className="text-green-600">→</span>
                  <span className="bg-white px-3 py-1 rounded border border-green-200">Submits form</span>
                  <span className="text-green-600">→</span>
                  <span className="bg-white px-3 py-1 rounded border border-green-200">Saved to SQL</span>
                  <span className="text-green-600">→</span>
                  <span className="bg-white px-3 py-1 rounded border border-green-200">Email via SendGrid</span>
                  <span className="text-green-600">→</span>
                  <span className="bg-white px-3 py-1 rounded border border-green-200">Practice notified</span>
                </div>
              </div>

              {/* Website Request Flow */}
              <div className="bg-cyan-50 rounded-lg p-5 border border-cyan-200">
                <h3 className="font-bold text-cyan-800 mb-3">Website Request Flow</h3>
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="bg-white px-3 py-1 rounded border border-cyan-200">www.clientsite.com</span>
                  <span className="text-cyan-600">→</span>
                  <span className="bg-white px-3 py-1 rounded border border-cyan-200">Cloudflare CDN</span>
                  <span className="text-cyan-600">→</span>
                  <span className="bg-white px-3 py-1 rounded border border-cyan-200">Azure LB</span>
                  <span className="text-cyan-600">→</span>
                  <span className="bg-white px-3 py-1 rounded border border-cyan-200">Web Server (IIS)</span>
                  <span className="text-cyan-600">→</span>
                  <span className="bg-white px-3 py-1 rounded border border-cyan-200">Lookup siteId</span>
                  <span className="text-cyan-600">→</span>
                  <span className="bg-white px-3 py-1 rounded border border-cyan-200">Render page</span>
                </div>
              </div>

              {/* Admin Auth Flow */}
              <div className="bg-indigo-50 rounded-lg p-5 border border-indigo-200">
                <h3 className="font-bold text-indigo-800 mb-3">Admin Authentication Flow</h3>
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="bg-white px-3 py-1 rounded border border-indigo-200">admin.doctorlogic.com</span>
                  <span className="text-indigo-600">→</span>
                  <span className="bg-white px-3 py-1 rounded border border-indigo-200">Google OAuth</span>
                  <span className="text-indigo-600">→</span>
                  <span className="bg-white px-3 py-1 rounded border border-indigo-200">Check permissions</span>
                  <span className="text-indigo-600">→</span>
                  <span className="bg-white px-3 py-1 rounded border border-indigo-200">Client or Internal view</span>
                </div>
              </div>
            </div>
          </section>

          {/* Additional Systems */}
          <section className="bg-white rounded-xl border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mt-0 mb-6">
              Other Systems
            </h2>

            <div className="space-y-4 not-prose text-gray-600">
              <div className="flex gap-3">
                <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                <div><strong>One-off Sales Apps:</strong> Various standalone applications built for sales team needs.</div>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                <div><strong>Server-side Caching:</strong> ASP.NET/IIS level caching for application data.</div>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                <div><strong>Billing:</strong> Handled offline via QuickBooks (not integrated into platform).</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
