import { redirect } from "next/navigation";
import { USER_ROUTES } from "@/routes";

export default function LoginRedirectPage() {
  redirect(USER_ROUTES.LOGIN);
}
