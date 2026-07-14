import { Link } from "react-router-dom";
import PolicyLayout from "./PolicyLayout.jsx";

const summary = [
  "Give accurate account info and keep your password private — don't share accounts.",
  "Free courses enroll instantly; premium courses need checkout first.",
  "Lecturer courses go through admin review before they go live for students.",
  "Don't hack the site, upload harmful content, or redistribute paid course materials.",
  "Accounts that break these rules can be suspended or removed.",
];

const sections = [
  {
    id: "introduction",
    icon: "fa-file-contract",
    title: "1. Introduction",
    navLabel: "Introduction",
    content: (
      <p>
        By creating an account or using EduFlow in any way, you agree to these
        Terms of Service. If you don't agree with them, please don't use the
        platform.
      </p>
    ),
  },
  {
    id: "accounts",
    icon: "fa-user-shield",
    title: "2. User Accounts",
    navLabel: "User Accounts",
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>
          You must provide correct, up-to-date information when signing up.
        </li>
        <li>You're responsible for keeping your password secure.</li>
        <li>Don't share your account with anyone else.</li>
        <li>
          Lecturer accounts are reviewed by an administrator before they can
          sign in and publish courses.
        </li>
      </ul>
    ),
  },
  {
    id: "enrollment",
    icon: "fa-graduation-cap",
    title: "3. Course Enrollment",
    navLabel: "Course Enrollment",
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>Students can enroll in any course marked as Active.</li>
        <li>
          Enrollment gives you access to that course's video and learning
          materials — free courses instantly, premium courses after checkout.
        </li>
        <li>
          Students may not share paid course materials with anyone who hasn't
          enrolled.
        </li>
      </ul>
    ),
  },
  {
    id: "lecturer",
    icon: "fa-chalkboard-user",
    title: "4. Lecturer Responsibilities",
    navLabel: "Lecturer Duties",
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>Upload educational content you have the rights to share.</li>
        <li>Don't upload copyrighted or illegal content.</li>
        <li>Keep course titles, descriptions, and pricing accurate.</li>
        <li>
          New and updated courses are submitted for admin review before they go
          live for students.
        </li>
      </ul>
    ),
  },
  {
    id: "conduct",
    icon: "fa-gavel",
    title: "5. User Conduct",
    navLabel: "User Conduct",
    content: (
      <>
        <p className="mb-2">Users must not:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Attempt to hack, exploit, or disrupt the website.</li>
          <li>Upload harmful, abusive, or illegal content.</li>
          <li>Copy or redistribute courses without permission.</li>
          <li>Abuse, harass, or impersonate other users.</li>
        </ul>
      </>
    ),
  },
  {
    id: "ip",
    icon: "fa-copyright",
    title: "6. Intellectual Property",
    navLabel: "Intellectual Property",
    content: (
      <p>
        Course videos and materials remain the property of the lecturers who
        created them. You may not reproduce, redistribute, or resell course
        content without the owner's permission.
      </p>
    ),
  },
  {
    id: "suspension",
    icon: "fa-ban",
    title: "7. Account Suspension",
    navLabel: "Account Suspension",
    content: (
      <p>
        EduFlow reserves the right to suspend or remove accounts that violate
        these terms, including Lecturer accounts found uploading copyrighted or
        harmful content.
      </p>
    ),
  },
  {
    id: "privacy",
    icon: "fa-lock",
    title: "8. Privacy Policy",
    navLabel: "Privacy Link",
    content: (
      <p>
        Your personal information is handled according to our{" "}
        <Link
          to="/privacy"
          className="text-[#142175] font-semibold underline underline-offset-4 hover:text-blue-700 transition-colors"
        >
          Privacy Policy
        </Link>
        .
      </p>
    ),
  },
  {
    id: "changes",
    icon: "fa-clock-rotate-left",
    title: "9. Changes to Terms",
    navLabel: "Updates to Terms",
    content: (
      <p>
        EduFlow may update these terms from time to time. Continued use of the
        platform after changes means you accept the updated terms.
      </p>
    ),
  },
  {
    id: "contact",
    icon: "fa-envelope",
    title: "10. Contact Information",
    navLabel: "Contact Details",
    content: (
      <p>
        Questions about these terms? Reach out at{" "}
        <a
          href="mailto:support@eduflow.com"
          className="text-[#142175] font-semibold underline underline-offset-4 hover:text-blue-700 transition-colors"
        >
          support@eduflow.com
        </a>{" "}
        or on our{" "}
        <a
          href="https://telegram.org"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#142175] font-semibold underline underline-offset-4 hover:text-blue-700 transition-colors"
        >
          Telegram Channel
        </a>
        .
      </p>
    ),
  },
];

export default function Terms() {
  return (
    <PolicyLayout
      title="Terms of Service"
      updated="2026"
      summary={summary}
      sections={sections}
    />
  );
}
