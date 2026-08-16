import { Suspense } from "react";
import AdminLoginForm from "./AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh]" />}>
      <AdminLoginForm />
    </Suspense>
  );
}
