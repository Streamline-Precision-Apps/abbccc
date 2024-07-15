import { User } from "@/lib/types";
import "@/app/globals.css";
import { useRouter } from "next/navigation";

interface Props {
  user: User;
  display: boolean;
}

export default function BreakWidgetSection({ user, display }: Props) {
  const router = useRouter();
  const loadNextPage = () => {
    router.push("/dashboard");
  };
  return display ? (
    <div className="flex flex-col items-center w-11/12 h-1/2 m-auto ">
      <button
        className="bg-app-green text-4xl font-semibold text-black w-full h-full rounded-lg mb-10 border-2 border-black"
        onClick={loadNextPage}
      >
        Clock in
      </button>
    </div>
  ) : null;
}
