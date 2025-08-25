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
    <ToastProvider data-oid="2..5uin">
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props} data-oid="-ynzfng">
            <div className="grid gap-1" data-oid="zedoqbu">
              {title && <ToastTitle data-oid="mzkk6pd">{title}</ToastTitle>}
              {description && (
                <ToastDescription data-oid="f6.x88c">
                  {description}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose data-oid="x_q4j4j" />
          </Toast>
        );
      })}
      <ToastViewport data-oid="cbtna5i" />
    </ToastProvider>
  );
}
