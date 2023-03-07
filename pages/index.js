import { useEffect } from "react";
import { useRouter } from "next/router";
import { useUser } from "../contexts/AppContext";
import LoadingPage from "../components/loading/LoadingPage";
import { useSession } from "next-auth/react";

export default function Index() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const shouldRedirectToLogin = !session;

  useEffect(() => {
    if (shouldRedirectToLogin) {
      router.push("/login");
    } else {
      router.push("/home");
    }
  }, [shouldRedirectToLogin, router]);

  return <LoadingPage />;
}
