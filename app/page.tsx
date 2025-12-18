import { redirect } from "next/navigation";

export default async function Home() {
  // Always redirect to dashboard for preview purposes
  redirect("/dashboard");
}
