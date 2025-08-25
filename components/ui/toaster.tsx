"use client";

import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider data-oid="1qs-i4c">
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props} data-oid="jpuerez">
            <div className="grid gap-1" data-oid="8ng-464">
              {title && <ToastTitle data-oid="il9_073">{title}</ToastTitle>}
              {description && (
                <ToastDescription data-oid="0sspio.">
                  {description}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose data-oid="sheniue" />
          </Toast>
        );
      })}
      <ToastViewport data-oid="vieiktf" />
    </ToastProvider>
  );
}
