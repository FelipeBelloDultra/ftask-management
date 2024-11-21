import { EyeIcon, EyeOffIcon } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

import { Choose, Otherwise, When } from "./conditionals";
import { Button } from "./ui/button";
import { Input, InputProps } from "./ui/input";

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);

  function handleToggleShowPassword() {
    setShowPassword((prev) => !prev);
  }

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        className={cn("hide-password-toggle pr-10", className)}
        ref={ref}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
        onClick={handleToggleShowPassword}
      >
        <Choose>
          <When condition={showPassword}>
            <EyeIcon className="h-4 w-4" aria-hidden="true" />
          </When>

          <Otherwise>
            <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
          </Otherwise>
        </Choose>
        <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
      </Button>

      {/* hides browsers password toggles */}
      <style>{`
					.hide-password-toggle::-ms-reveal,
					.hide-password-toggle::-ms-clear {
						visibility: hidden;
						pointer-events: none;
						display: none;
					}
				`}</style>
    </div>
  );
});
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
