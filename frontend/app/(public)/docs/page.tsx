import PageLayout from "@/components/PageLayout";
import CodeBlock from "@/components/CodeBlock";

export default function Documentation() {
  const sections = [
    { label: "Getting Started", href: "#getting-started" },
    { label: "Installation", href: "#installation" },
    { label: "Quick Start", href: "#quick-start" },
    { label: "API Reference", href: "#api-reference" },
    { label: "Authentication", href: "#authentication" },
    { label: "CLI Tools", href: "#cli-tools" },
    { label: "Troubleshooting", href: "#troubleshooting" }
  ];

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-6 py-24 flex gap-12">
        {/* Documentation Navigation */}
        <aside className="w-64 flex-shrink-0">
          <div className="sticky top-24">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
              DOCUMENTATION
            </h3>
            <nav className="space-y-1">
              {sections.map((section) => (
                <a
                  key={section.href}
                  href={section.href}
                  className="block px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  {section.label}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 max-w-3xl">
          <h1 className="text-5xl font-black text-white mb-8 uppercase tracking-tight">
            DOCUMENTATION
          </h1>

          {/* Search Bar */}
          <div className="mb-12">
            <div className="relative">
              <input
                type="text"
                placeholder="Search documentation..."
                className="w-full px-4 py-3 pl-12 bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder:text-gray-600"
              />
              <svg
                className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Getting Started Section */}
          <section id="getting-started" className="mb-16">
            <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tight">
              GETTING STARTED
            </h2>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Welcome to CodeCollab! This guide will help you get up and running in minutes.
              CodeCollab is a real-time collaborative coding platform that lets you code together
              with your team from anywhere in the world.
            </p>
            <div className="p-6 bg-blue-500/10 border border-blue-500/30 mb-6">
              <p className="text-blue-400 text-sm">
                <span className="font-bold uppercase tracking-wider">TIP:</span> New to CodeCollab?
                Start with our Quick Start guide below to create your first project.
              </p>
            </div>
          </section>

          {/* Installation Section */}
          <section id="installation" className="mb-16">
            <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tight">
              INSTALLATION
            </h2>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Install the CodeCollab CLI to manage your projects from the command line.
            </p>
            <CodeBlock
              code="npm install -g codecollab-cli"
              language="bash"
              className="mb-4"
            />
            <p className="text-gray-400 mb-4 leading-relaxed">
              Or using yarn:
            </p>
            <CodeBlock
              code="yarn global add codecollab-cli"
              language="bash"
              className="mb-4"
            />
            <p className="text-gray-400 mb-4 leading-relaxed">
              Verify the installation:
            </p>
            <CodeBlock
              code="codecollab --version"
              language="bash"
            />
          </section>

          {/* Quick Start Section */}
          <section id="quick-start" className="mb-16">
            <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tight">
              QUICK START
            </h2>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Create your first project and start collaborating in under 2 minutes.
            </p>
            
            <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-wide">
              1. Login to CodeCollab
            </h3>
            <CodeBlock
              code="codecollab login"
              language="bash"
              className="mb-6"
            />

            <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-wide">
              2. Create a New Project
            </h3>
            <CodeBlock
              code="codecollab create my-project"
              language="bash"
              className="mb-6"
            />

            <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-wide">
              3. Invite Collaborators
            </h3>
            <CodeBlock
              code="codecollab invite user@example.com"
              language="bash"
              className="mb-6"
            />

            <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-wide">
              4. Start Coding
            </h3>
            <CodeBlock
              code="codecollab open my-project"
              language="bash"
            />
          </section>

          {/* API Reference Section */}
          <section id="api-reference" className="mb-16">
            <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tight">
              API REFERENCE
            </h2>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Use the CodeCollab API to integrate with your existing tools and workflows.
            </p>

            <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-wide">
              Initialize the Client
            </h3>
            <CodeBlock
              code={`import { CodeCollab } from '@codecollab/sdk';

const client = new CodeCollab({
  apiKey: process.env.CODECOLLAB_API_KEY,
  region: 'us-east-1'
});`}
              language="typescript"
              className="mb-6"
            />

            <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-wide">
              Create a Project
            </h3>
            <CodeBlock
              code={`const project = await client.projects.create({
  name: 'My Awesome Project',
  description: 'Building something great',
  visibility: 'private'
});

console.log('Project created:', project.id);`}
              language="typescript"
              className="mb-6"
            />

            <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-wide">
              List Projects
            </h3>
            <CodeBlock
              code={`const projects = await client.projects.list({
  limit: 10,
  offset: 0
});

projects.forEach(project => {
  console.log(project.name);
});`}
              language="typescript"
            />
          </section>

          {/* Authentication Section */}
          <section id="authentication" className="mb-16">
            <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tight">
              AUTHENTICATION
            </h2>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Secure your API requests with authentication tokens.
            </p>
            <CodeBlock
              code={`// Generate an API key from your dashboard
const apiKey = 'cc_live_1234567890abcdef';

// Use it in your requests
const response = await fetch('https://api.codecollab.io/v1/projects', {
  headers: {
    'Authorization': \`Bearer \${apiKey}\`,
    'Content-Type': 'application/json'
  }
});`}
              language="typescript"
            />
          </section>

          {/* CLI Tools Section */}
          <section id="cli-tools" className="mb-16">
            <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tight">
              CLI TOOLS
            </h2>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Common CLI commands for managing your projects.
            </p>
            <div className="space-y-4">
              <div>
                <p className="text-white font-bold mb-2">List all projects:</p>
                <CodeBlock code="codecollab list" language="bash" />
              </div>
              <div>
                <p className="text-white font-bold mb-2">Delete a project:</p>
                <CodeBlock code="codecollab delete my-project" language="bash" />
              </div>
              <div>
                <p className="text-white font-bold mb-2">View project status:</p>
                <CodeBlock code="codecollab status my-project" language="bash" />
              </div>
            </div>
          </section>

          {/* Troubleshooting Section */}
          <section id="troubleshooting" className="mb-16">
            <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tight">
              TROUBLESHOOTING
            </h2>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Common issues and their solutions.
            </p>
            <div className="space-y-6">
              <div className="p-6 bg-white/[0.02] border border-white/10">
                <h3 className="text-white font-bold mb-2 uppercase tracking-wide">
                  Connection Issues
                </h3>
                <p className="text-gray-400 text-sm mb-3">
                  If you're experiencing connection problems, try these steps:
                </p>
                <ul className="list-disc list-inside text-gray-400 text-sm space-y-1">
                  <li>Check your internet connection</li>
                  <li>Verify your firewall settings</li>
                  <li>Try using a different network</li>
                  <li>Contact support if the issue persists</li>
                </ul>
              </div>

              <div className="p-6 bg-white/[0.02] border border-white/10">
                <h3 className="text-white font-bold mb-2 uppercase tracking-wide">
                  Authentication Errors
                </h3>
                <p className="text-gray-400 text-sm mb-3">
                  If you're getting authentication errors:
                </p>
                <ul className="list-disc list-inside text-gray-400 text-sm space-y-1">
                  <li>Verify your API key is correct</li>
                  <li>Check if your key has expired</li>
                  <li>Ensure you have the necessary permissions</li>
                  <li>Try logging out and back in</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Help Section */}
          <div className="p-8 bg-white/[0.02] border border-white/10 text-center">
            <h3 className="text-2xl font-black text-white mb-3 uppercase tracking-tight">
              NEED MORE HELP?
            </h3>
            <p className="text-gray-400 mb-6">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm uppercase tracking-wider transition-all relative overflow-hidden group">
              <span className="relative z-10">CONTACT SUPPORT</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
