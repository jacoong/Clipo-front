import React from 'react';

interface NoNumberLoadProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  isDark?: boolean;
  className?: string;
}
const DefaultIcon: React.FC<{ className: string }> = ({ className }) => {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
  );
};

const NoNumberLoad: React.FC<NoNumberLoadProps> = ({
  icon,
  title,
  description,
  isDark = false,
  className = '',
}) => {
  const iconClassName = `w-16 h-16 mx-auto ${isDark ? 'text-gray-600' : 'text-gray-300'}`;

  return (
    <div className={`flex flex-col items-center justify-center py-12 px-6 ${isDark ? 'text-gray-400' : 'text-gray-500'} ${className}`}>
      <div className="text-center">
        <div className="mb-4">
          {icon
            ? (React.isValidElement(icon)
                ? React.cloneElement(icon as React.ReactElement, {
                    className: [
                      (icon as any).props?.className,
                      iconClassName,
                    ]
                      .filter(Boolean)
                      .join(' '),
                  })
                : icon)
            : <DefaultIcon className={iconClassName} />}
        </div>
        <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          {title}
        </h3>
        {description ? (
          <p className="text-sm leading-relaxed whitespace-pre-line">{description}</p>
        ) : null}
      </div>
    </div>
  );
};

export default NoNumberLoad;


