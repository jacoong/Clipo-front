import { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { className?: string };

const combineClassName = (base: string, extra?: string) =>
  extra ? `${base} ${extra}` : base;

export const GoogleLogo = ({ className, ...props }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
    className={combineClassName('h-6 w-6', className)}
    {...props}
  >
    <path
      d="M23.04 12.261c0-.815-.073-1.595-.209-2.352H12v4.455h6.198a5.3 5.3 0 0 1-2.297 3.469v2.882h3.708c2.172-1.999 3.431-4.945 3.431-8.454Z"
      fill="#4285F4"
    />
    <path
      d="M12 24c3.105 0 5.708-1.026 7.61-2.783l-3.708-2.882c-1.032.693-2.356 1.102-3.902 1.102-3.001 0-5.545-2.02-6.455-4.74H1.688v2.985C3.581 21.784 7.482 24 12 24Z"
      fill="#34A853"
    />
    <path
      d="M5.545 14.697A7.19 7.19 0 0 1 5.16 12c0-.937.16-1.847.385-2.697V6.318H1.688A11.997 11.997 0 0 0 0 12c0 1.892.455 3.679 1.688 5.682l3.857-2.985Z"
      fill="#FBBC05"
    />
    <path
      d="M12 4.752c1.689 0 3.208.582 4.399 1.715l3.307-3.307C17.703 1.125 15.105 0 12 0 7.482 0 3.581 2.216 1.688 6.318l3.857 2.985C6.455 6.772 8.999 4.752 12 4.752Z"
      fill="#EA4335"
    />
  </svg>
);

export const KakaoLogo = ({ className, ...props }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
    className={combineClassName('h-6 w-6', className)}
    {...props}
  >
    <rect width="24" height="24" rx="12" fill="#3C1E1E" />
    <path
      d="M12.001 6.5c-3.59 0-6.5 2.27-6.5 5.07 0 1.88 1.246 3.52 3.116 4.39-.12.44-.79 2.88-.82 3.09 0 0 0 .07.04.07.25 0 2.89-1.99 3.35-2.32.29.04.58.06.88.06 3.59 0 6.5-2.27 6.5-5.07 0-2.8-2.91-5.07-6.5-5.07Z"
      fill="#FAE100"
    />
  </svg>
);

export const NaverLogo = ({ className, ...props }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
    className={combineClassName('h-6 w-6', className)}
    {...props}
  >
    <rect width="24" height="24" rx="5" fill="#03C75A" />
    <path
      d="M14.524 6.5v6.066L9.742 6.5H6.5v11h2.976v-6.066L14.258 17.5H17.5v-11h-2.976Z"
      fill="white"
    />
  </svg>
);

export default { GoogleLogo, KakaoLogo, NaverLogo };
