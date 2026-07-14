import PolicyLayout from "./PolicyLayout.jsx";

const summary = [
  "Can't watch a video? You need to be enrolled in that course first.",
  "Lecturer account stuck? It needs admin approval before you can sign in.",
  "Still stuck? Message us on Telegram — we reply fast.",
];

const sections = [
  {
    id: "lecturer-approval",
    icon: "fa-user-clock",
    title: "I signed up as a Lecturer but can't log in yet.",
    navLabel: "Lecturer approval",
    content: (
      <p>
        Lecturer accounts need to be approved by an administrator first. You'll
        be able to sign in as soon as your account is confirmed.
      </p>
    ),
  },
  {
    id: "watch-video",
    icon: "fa-video",
    title: "Why can't I watch a course video?",
    navLabel: "Watching videos",
    content: (
      <p>
        You need to be enrolled in a course to watch it. Open the course's
        detail page and click Enroll — free courses enroll instantly, premium
        courses require checkout first.
      </p>
    ),
  },
  {
    id: "become-instructor",
    icon: "fa-chalkboard-teacher",
    title: "How do I become an Instructor?",
    navLabel: "Becoming an Instructor",
    content: (
      <p>
        Click "Become an Instructor" on the homepage, or sign up for a new
        account and choose the Lecturer role. Your account will need admin
        approval before you can sign in.
      </p>
    ),
  },
  {
    id: "forgot-password",
    icon: "fa-key",
    title: "I forgot my password.",
    navLabel: "Forgot password",
    content: (
      <p>
        Use the "Forgot Password?" link on the login page, or reach out to us on
        Telegram for help.
      </p>
    ),
  },
];

function ContactCard() {
  return (
    <div className="bg-[#142175] rounded-2xl p-8 text-center text-white">
      <p className="text-lg font-semibold">Still need help?</p>
      <p className="text-blue-100 mt-1">
        Message our support team on Telegram and we'll get back to you.
      </p>
      <a
        href="https://telegram.org"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-5 bg-white text-[#142175] px-6 py-3 rounded-lg font-medium cursor-pointer hover:bg-gray-100 transition-colors duration-200"
      >
        <i className="fa-brands fa-telegram mr-2"></i>
        Chat on Telegram
      </a>
    </div>
  );
}

export default function Support() {
  return (
    <PolicyLayout
      title="Support"
      summaryTitle="Quick Answers"
      summaryIcon="fa-circle-question"
      summary={summary}
      sections={sections}
      footer={<ContactCard />}
    />
  );
}
