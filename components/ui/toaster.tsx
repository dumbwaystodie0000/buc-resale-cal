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
    <ToastProvider data-oid="8mk5q_w">
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props} data-oid="lrhnx:l">
            <div className="grid gap-1" data-oid="-haje.g">
              {title && <ToastTitle data-oid="wya8r9_">{title}</ToastTitle>}
              {description && (
                <ToastDescription data-oid="es6:uxh">
                  {description}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose data-oid="v:itgx2" />
          </Toast>
        );
      })}
      <ToastViewport data-oid="ogh14.3" />
    </ToastProvider>
  );
}
