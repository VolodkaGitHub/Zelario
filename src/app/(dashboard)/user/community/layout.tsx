"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { cn } from "@/lib/utils";
import { USER_ROUTES } from "@/routes";

const Navbar = dynamic(() => import("@/components/home/navbar"), { ssr: false });
const Sidebar = dynamic(() => import("@/components/community/sidebar"), {
  ssr: false,
});
const RightSidebar = dynamic(
  () => import("@/components/community/right-sidebar"),
  { ssr: false, loading: () => null }
);

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { isAuthenticated } = useSelector(
    (state: RootState) => state.userAuth
  );

  if (pathname?.includes("/compose/tweet")) {
    return <div className="min-h-screen bg-slate-950">{children}</div>;
  }

  const isLandingPage =
    !isAuthenticated && pathname === USER_ROUTES.COMMUNITY;

  if (isLandingPage) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Navbar />
        {children}
      </div>
    );
  }

  const isMessagesPage = pathname?.includes("/messages");

  return (
    <div
      className={cn(
        "bg-slate-950",
        isMessagesPage
          ? "h-screen overflow-hidden flex flex-col"
          : "min-h-screen"
      )}
    >
      <Navbar />
      <Sidebar />
      {!isMessagesPage && <RightSidebar />}

      <div
        className={cn(
          "pt-[4.5rem] lg:pb-0 font-sans",
          isMessagesPage
            ? "h-[100dvh] overflow-hidden flex flex-col min-h-0"
            : "min-h-screen pb-20",
          "lg:ml-[88px] xl:ml-[275px]",
          !isMessagesPage && "xl:mr-80"
        )}
      >
        <div
          className={cn(
            "border-slate-800 transition-all",
            isMessagesPage
              ? "w-full h-full border-0 flex flex-col min-h-0 relative"
              : "min-h-screen mx-auto max-w-[600px] w-full border-x mb-20 md:mb-0"
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
