import { useContext } from "react";
import { Bell, Menu } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";

const DashboardHeader = ({ title, description, onMenuClick }) => {
  const { user } = useContext(AuthContext);

  return (
    <header className="sticky top-0 z-40 border-b border-primary/10 bg-base-100/95 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-4 px-3 py-3 sm:px-4 lg:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="btn btn-ghost btn-square lg:hidden"
            aria-label="Open dashboard menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="min-w-0">
            <h1 className="truncate font-playfair text-2xl font-semibold">{title}</h1>
            <p className="truncate text-sm text-base-content/70">{description}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="btn btn-ghost btn-square rounded-xl border border-primary/10 hover:border-primary/30 hover:bg-primary/10"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5 text-primary" />
          </button>

          <div className="hidden items-center gap-3 rounded-2xl border border-primary/10 bg-base-100 px-3 py-2 shadow-sm sm:flex">
            <div className="avatar">
              <div className="h-10 w-10 rounded-full ring-1 ring-primary/30 ring-offset-2 ring-offset-base-100">
                {user?.profilePhoto ? (
                  <img src={user.profilePhoto} alt={user.name} />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary font-semibold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm font-semibold">{user?.name || "Guest"}</p>
              <p className="text-xs text-base-content/70">{user?.email || "-"}</p>
            </div>

            <span className="rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              {user?.role || "user"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
