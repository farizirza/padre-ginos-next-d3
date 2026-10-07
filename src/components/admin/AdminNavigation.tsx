import { getCurrentUser } from "@/lib/auth";
import { can } from "@/lib/permissions";
import AdminNav from "./AdminNav";

export default async function AdminNavigation() {
  const user = await getCurrentUser();
  return <AdminNav canManageProducts={can(user, "products:manage")} />;
}
