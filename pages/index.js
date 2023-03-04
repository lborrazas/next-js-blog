import { useEffect } from "react";
import { useRouter } from "next/router";
import { useUser } from "../contexts/AppContext";
import LoadingPage from "../components/loading/LoadingPage";

export default function Index() {
  const user = useUser();
  const router = useRouter();

  const shouldRedirectToLogin = !user;

  useEffect(() => {
    if (shouldRedirectToLogin) {
      router.push("/login");
    } else {
      router.push("home");
    }
  }, [shouldRedirectToLogin, router]);

  return <LoadingPage />;
}
