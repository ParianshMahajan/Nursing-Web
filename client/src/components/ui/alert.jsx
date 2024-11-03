import React from 'react';
import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';

const Alert = React.forwardRef(({ className, variant = "default", children, ...props }, ref) => {
  const variantStyles = {
    default: "bg-background text-foreground border-teal-200",
    destructive: "border-red-500/50 text-red-600 dark:border-red-500 [&>svg]:text-red-600 bg-red-50",
    success: "border-green-500/50 text-green-600 dark:border-green-500 [&>svg]:text-green-600 bg-green-50",
    warning: "border-yellow-500/50 text-yellow-600 dark:border-yellow-500 [&>svg]:text-yellow-600 bg-yellow-50",
    info: "border-blue-500/50 text-blue-600 dark:border-blue-500 [&>svg]:text-blue-600 bg-blue-50"
  };

  const icons = {
    default: Info,
    destructive: XCircle,
    success: CheckCircle2,
    warning: AlertTriangle,
    info: Info
  };

  const IconComponent = icons[variant];

  return (
    <div
      ref={ref}
      role="alert"
      className={`relative w-full rounded-lg border p-4 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      <div className="flex gap-3">
        <IconComponent className="h-5 w-5" />
        <div>{children}</div>
      </div>
    </div>
  );
});

Alert.displayName = "Alert";

const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={`mb-1 font-medium leading-none tracking-tight ${className}`}
    {...props}
  />
));

AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`text-sm [&_p]:leading-relaxed ${className}`}
    {...props}
  />
));

AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };