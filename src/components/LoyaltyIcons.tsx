type IconProps = {
  className?: string;
};

export function PasteIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
      <path
        d="M22 14c-3-4 2-6 0-10M32 13c-3-4 2-6 0-10M42 14c-3-4 2-6 0-10"
        fill="none"
        stroke="#4A6B8A"
        strokeWidth="2"
        strokeLinecap="round"
        opacity=".6"
      />
      <path
        d="M6 51C6 30 18 19 32 19s26 11 26 32z"
        fill="#E2B57A"
        stroke="#3A5570"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      <path
        d="M12 48C13 35 21 27 32 26"
        fill="none"
        stroke="#F6DDB6"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M9 46C11 32 20 23 32 22.5S53 32 55 46"
        fill="none"
        stroke="#9A5C24"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeDasharray="1.4 5.4"
      />
      <circle cx="42" cy="39" r="1.4" fill="#9A5C24" />
      <circle cx="34" cy="44" r="1.4" fill="#9A5C24" />
      <circle cx="46" cy="46" r="1.4" fill="#9A5C24" />
    </svg>
  );
}

export function InkPasteIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
      <path d="M6 50C6 29 18 18 32 18s26 11 26 32z" fill="#F2EBD9" />
      <path
        d="M12 47C14 35 21 28 32 27"
        fill="none"
        stroke="#3A5570"
        strokeWidth="3"
        strokeLinecap="round"
        opacity=".5"
      />
      <path
        d="M10 44C12 32 20 24 32 23.5S52 32 54 44"
        fill="none"
        stroke="#3A5570"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeDasharray="1.4 5.4"
      />
    </svg>
  );
}

export function SalsaIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 40 64" aria-hidden="true">
      <rect x="15" y="2" width="10" height="9" rx="2" fill="#3A5570" />
      <path
        d="M14 11h12l1 7c7 3 9 9 9 16v22c0 4-3 6-6 6H10c-3 0-6-2-6-6V34c0-7 2-13 9-16z"
        fill="#C4843F"
        stroke="#3A5570"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      <rect x="7" y="31" width="26" height="19" rx="3" fill="#F2EBD9" stroke="#3A5570" strokeWidth="2" />
      <path d="M20 35c4 0 5 2 5 4s-3 2-3 5c-1-3-5-2-5-5 0-2 1-4 3-4z" fill="#4A6B8A" />
    </svg>
  );
}

export function CafeIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
      <path
        d="M20 14c-3-4 2-6 0-10M30 14c-3-4 2-6 0-10M40 14c-3-4 2-6 0-10"
        fill="none"
        stroke="#4A6B8A"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity=".7"
      />
      <path
        d="M48 28h5a7 7 0 010 14h-6"
        fill="none"
        stroke="#3A5570"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M8 22h42v18c0 10-7 17-17 17h-8C15 57 8 50 8 40z"
        fill="#FAF6EA"
        stroke="#3A5570"
        strokeWidth="2.8"
        strokeLinejoin="round"
      />
      <path d="M8 22h42v6H8z" fill="#9A5C24" stroke="#3A5570" strokeWidth="2.6" />
      <path
        d="M17 37c0 6 3 11 8 13"
        fill="none"
        stroke="#E2B57A"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ArrowIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 12h15M13 5l7 7-7 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CheckNoteIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10.5" fill="none" stroke="#C4843F" strokeWidth="1.5" />
      <path
        d="M7.5 12.5l3 3L16.5 9"
        fill="none"
        stroke="#9A5C24"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function StepVisitIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
      <circle
        cx="32"
        cy="32"
        r="23"
        fill="none"
        stroke="#4A6B8A"
        strokeWidth="2.4"
        strokeDasharray="2 5"
        strokeLinecap="round"
      />
      <circle cx="32" cy="32" r="15" fill="#3A5570" />
      <g transform="translate(19 19) scale(.4)">
        <path d="M6 50C6 29 18 18 32 18s26 11 26 32z" fill="#F2EBD9" />
        <path
          d="M12 47C14 35 21 28 32 27"
          fill="none"
          stroke="#3A5570"
          strokeWidth="3"
          strokeLinecap="round"
          opacity=".5"
        />
        <path
          d="M10 44C12 32 20 24 32 23.5S52 32 54 44"
          fill="none"
          stroke="#3A5570"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeDasharray="1.4 5.4"
        />
      </g>
    </svg>
  );
}

export function StepChooseIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
      <g transform="translate(3 9) scale(0.6)">
        <rect x="15" y="2" width="10" height="9" rx="2" fill="#3A5570" />
        <path
          d="M14 11h12l1 7c7 3 9 9 9 16v22c0 4-3 6-6 6H10c-3 0-6-2-6-6V34c0-7 2-13 9-16z"
          fill="#C4843F"
          stroke="#3A5570"
          strokeWidth="2.6"
          strokeLinejoin="round"
        />
        <rect x="7" y="31" width="26" height="19" rx="3" fill="#F2EBD9" stroke="#3A5570" strokeWidth="2" />
        <path d="M20 35c4 0 5 2 5 4s-3 2-3 5c-1-3-5-2-5-5 0-2 1-4 3-4z" fill="#4A6B8A" />
      </g>
      <g transform="translate(26 16) scale(0.53)">
        <path
          d="M20 14c-3-4 2-6 0-10M30 14c-3-4 2-6 0-10M40 14c-3-4 2-6 0-10"
          fill="none"
          stroke="#4A6B8A"
          strokeWidth="2.2"
          strokeLinecap="round"
          opacity=".7"
        />
        <path
          d="M48 28h5a7 7 0 010 14h-6"
          fill="none"
          stroke="#3A5570"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M8 22h42v18c0 10-7 17-17 17h-8C15 57 8 50 8 40z"
          fill="#FAF6EA"
          stroke="#3A5570"
          strokeWidth="2.8"
          strokeLinejoin="round"
        />
        <path d="M8 22h42v6H8z" fill="#9A5C24" stroke="#3A5570" strokeWidth="2.6" />
        <path
          d="M17 37c0 6 3 11 8 13"
          fill="none"
          stroke="#E2B57A"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
