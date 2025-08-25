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
    <ToastProvider data-oid="r2t9eua">
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props} data-oid="ocn50gr">
            <div className="grid gap-1" data-oid="ruk2b_8">
              {title && <ToastTitle data-oid="hfgurw5">{title}</ToastTitle>}
              {description && (
                <ToastDescription data-oid="1yls.m2">
                  {description}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose data-oid="3u8qsm6" />
          </Toast>
        );
      })}
      <ToastViewport data-oid="5-t9pi." />
    </ToastProvider>
  );
}
