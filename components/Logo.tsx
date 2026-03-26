export default function Logo({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <line x1="6" y1="26" x2="26" y2="26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="7" y="18" width="4" height="7" rx="1" fill="currentColor" />
      <rect x="14" y="12" width="4" height="13" rx="1" fill="currentColor" />
      <rect x="21" y="6" width="4" height="19" rx="1" fill="currentColor" />
    </svg>
  );
}
