import PolicyLayout from "./PolicyLayout.jsx";

const summary = [
  "We only collect what's needed to run your account and your courses.",
  "Passwords are encrypted via hash encryption — we never save plain text.",
  "Your data is used to run EduFlow features, never sold to third parties.",
  "You can modify profile entries anytime, or request permanent removal.",
];

const sections = [
  {
    id: "collect",
    icon: "fa-database",
    title: "1. Information We Collect",
    navLabel: "Collected Data",
    content: (
      <p>
        When you set up an EduFlow profile, our database stores parameters
        including your full name, verified email address, phone contact, gender,
        date of birth, and assigned account operational role (Student, Lecturer,
        or System Administrator).
      </p>
    ),
  },
  {
    id: "use",
    icon: "fa-sliders",
    title: "2. How We Use Your Information",
    navLabel: "Platform Scope",
    content: (
      <p>
        Your attributes facilitate internal processing layers: handling course
        enrollment registrations, logging classroom lecture tracking metrics,
        verifying lecturer control permissions, and populating the main system
        dashboard logs.
      </p>
    ),
  },
  {
    id: "storage",
    icon: "fa-shield-halved",
    title: "3. Data Storage & Security",
    navLabel: "Storage Protection",
    content: (
      <p>
        Sensitive attributes—specifically passwords—are passed through automated
        modern cryptographic hashing algorithms before persistence. Raw strings
        are never accessible to infrastructure administrative operators.
      </p>
    ),
  },
  {
    id: "rights",
    icon: "fa-user-check",
    title: "4. Your Control Rights",
    navLabel: "Account Rights",
    content: (
      <p>
        Profiles maintain full write permissions over individual contextual
        credentials directly through settings windows. Requests for
        comprehensive data purging can be authorized by opening a ticket with
        system administration.
      </p>
    ),
  },
  {
    id: "contact",
    icon: "fa-paper-plane",
    title: "5. Contact & Support Escalations",
    navLabel: "Support Channels",
    content: (
      <p>
        For inquiries regarding user privacy controls or technical asset
        verification, please interface directly with our staff via the
        operational{" "}
        <a
          href="https://telegram.org"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#142175] font-semibold underline underline-offset-4 hover:text-blue-700 transition-colors"
        >
          Telegram support channel
        </a>
        .
      </p>
    ),
  },
];

export default function Privacy() {
  return (
    <PolicyLayout
      title="Privacy Policy"
      updated="2026"
      summary={summary}
      sections={sections}
    />
  );
}
