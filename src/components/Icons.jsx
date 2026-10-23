export function BrandMark({ size = 42, className = "" }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="24" cy="24" r="22.5" stroke="currentColor" strokeOpacity=".26" />
      <path
        d="M15.2 32.8c-.7-8.4 4.8-15.7 18-16.6.8 10.8-5.2 17.7-13.4 18.1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.8 33.2c2.5-5.6 7.2-9.6 13.2-12.1"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <circle cx="34.7" cy="14.6" r="1.35" fill="currentColor" fillOpacity=".75" />
    </svg>
  );
}

export function PlayIcon({ size = 17 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M7 5.6v8.8c0 .5.5.8.9.5l6.5-4.4a.6.6 0 0 0 0-1L7.9 5.1a.6.6 0 0 0-.9.5Z" fill="currentColor" />
    </svg>
  );
}

export function PauseIcon({ size = 17 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="6.2" y="5" width="2.4" height="10" rx="1.2" fill="currentColor" />
      <rect x="11.4" y="5" width="2.4" height="10" rx="1.2" fill="currentColor" />
    </svg>
  );
}

export function ResetIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M4.2 8.3A6.2 6.2 0 1 1 4.7 13"
        stroke="currentColor"
        strokeWidth="1.45"
        strokeLinecap="round"
      />
      <path d="M3.8 4.7v4h4" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronLeftIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M9.8 3.8 5.6 8l4.2 4.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronDownIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="m4.5 6.3 3.5 3.4 3.5-3.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ClockIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="5.9" stroke="currentColor" strokeWidth="1.25" />
      <path d="M8 4.9V8l2.2 1.4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CloseIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="m5.4 5.4 9.2 9.2M14.6 5.4l-9.2 9.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function ArrowUpRightIcon({ size = 13 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4.5 11.5 11.5 4.5M5.8 4.5h5.7v5.7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CheckIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m5.6 12.4 4.1 4.1 8.8-8.9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function EyeIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3.1 12s3.2-5.4 8.9-5.4S20.9 12 20.9 12s-3.2 5.4-8.9 5.4S3.1 12 3.1 12Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}
