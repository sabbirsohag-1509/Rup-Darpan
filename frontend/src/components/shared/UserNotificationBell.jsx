import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useNavigate } from "react-router";
import {
  Bell,
  CalendarDays,
  Check,
  CheckCheck,
  Star,
  Trash2,
  Send,
  XCircle,
  CircleCheck,
} from "lucide-react";

const API_URL = "http://localhost:5000";

// ============================================================
// NOTIFICATION SOUND
// ============================================================

const NOTIFICATION_SOUND = "/notification-sound.mp3";

// ============================================================
// FORMAT TIME AGO
// ============================================================

const formatTimeAgo = (date) => {
  const now = new Date();
  const created = new Date(date);

  const diffInSeconds = Math.floor((now - created) / 1000);

  if (diffInSeconds < 10) {
    return "Just now";
  }

  if (diffInSeconds < 60) {
    return `${diffInSeconds} sec ago`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);

  if (diffInMinutes < 60) {
    return `${diffInMinutes} min ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);

  if (diffInHours < 24) {
    return `${diffInHours} hr ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);

  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks > 1 ? "s" : ""} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);

  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;
  }

  const diffInYears = Math.floor(diffInDays / 365);

  return `${diffInYears} year${diffInYears > 1 ? "s" : ""} ago`;
};

// ============================================================
// API FUNCTIONS
// ============================================================

const fetchNotifications = async () => {
  const response = await axios.get(`${API_URL}/notifications`, {
    withCredentials: true,
  });

  return response.data.notifications || [];
};

const fetchUnreadCount = async () => {
  const response = await axios.get(
    `${API_URL}/notifications/unread-count`,
    {
      withCredentials: true,
    },
  );

  return response.data.unreadCount || 0;
};

// ============================================================
// NOTIFICATION SKELETON
// ============================================================

const NotificationSkeleton = () => {
  return (
    <div className="flex gap-3 border-b border-base-200 px-4 py-3">
      {/* Icon Skeleton */}

      <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-base-300" />

      {/* Content Skeleton */}

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <div className="h-3.5 w-32 animate-pulse rounded bg-base-300" />

          <div className="h-2 w-2 animate-pulse rounded-full bg-base-300" />
        </div>

        <div className="mt-2 h-3 w-full animate-pulse rounded bg-base-300" />

        <div className="mt-1.5 h-3 w-3/4 animate-pulse rounded bg-base-300" />

        <div className="mt-2 h-2.5 w-20 animate-pulse rounded bg-base-300" />
      </div>
    </div>
  );
};

// ============================================================
// USER NOTIFICATION BELL
// ============================================================

const UserNotificationBell = () => {
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);

  // Previous unread count
  const previousUnreadCountRef = useRef(null);

  // Audio reference
  const notificationAudioRef = useRef(null);

  const queryClient = useQueryClient();

  const navigate = useNavigate();

  // ==========================================================
  // CREATE AUDIO INSTANCE
  // ==========================================================

  useEffect(() => {
    const audio = new Audio(NOTIFICATION_SOUND);

    audio.preload = "auto";

    notificationAudioRef.current = audio;

    return () => {
      audio.pause();
      audio.currentTime = 0;
      notificationAudioRef.current = null;
    };
  }, []);

  // ==========================================================
  // PLAY NOTIFICATION SOUND
  // ==========================================================

  const playNotificationSound = () => {
    const audio = notificationAudioRef.current;

    if (!audio) return;

    try {
      audio.currentTime = 0;

      const playPromise = audio.play();

      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.warn(
            "Notification sound could not be played:",
            error,
          );
        });
      }
    } catch (error) {
      console.warn("Notification sound error:", error);
    }
  };

  // ==========================================================
  // NOTIFICATIONS QUERY
  // ==========================================================

  const {
    data: notifications = [],
    isLoading: notificationsLoading,
    isError: notificationsError,
  } = useQuery({
    queryKey: ["user-notifications"],
    queryFn: fetchNotifications,
    enabled: open,
    staleTime: 30 * 1000,
  });

  // ==========================================================
  // UNREAD COUNT QUERY
  // ==========================================================

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ["user-notifications", "unread-count"],
    queryFn: fetchUnreadCount,
    staleTime: 30 * 1000,

    // Check every 10 seconds
    refetchInterval: 10 * 1000,
  });

  // ==========================================================
  // PLAY SOUND WHEN NEW NOTIFICATION ARRIVES
  // ==========================================================

  useEffect(() => {
    // First API response
    // Don't play sound for existing notifications

    if (previousUnreadCountRef.current === null) {
      previousUnreadCountRef.current = unreadCount;

      return;
    }

    // New unread notification arrived

    if (unreadCount > previousUnreadCountRef.current) {
      playNotificationSound();
    }

    previousUnreadCountRef.current = unreadCount;
  }, [unreadCount]);

  // ==========================================================
  // MARK SINGLE NOTIFICATION AS READ
  // ==========================================================

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId) => {
      await axios.patch(
        `${API_URL}/notifications/${notificationId}/read`,
        {},
        {
          withCredentials: true,
        },
      );

      return notificationId;
    },

    onSuccess: (notificationId) => {
      // Update notification cache

      queryClient.setQueryData(
        ["user-notifications"],
        (oldNotifications = []) =>
          oldNotifications.map((notification) =>
            notification._id === notificationId
              ? {
                  ...notification,
                  isRead: true,
                }
              : notification,
          ),
      );

      // Update unread count

      queryClient.setQueryData(
        ["user-notifications", "unread-count"],
        (oldCount = 0) => Math.max(oldCount - 1, 0),
      );
    },

    onError: (error) => {
      console.error(
        "Failed to mark notification as read:",
        error,
      );
    },
  });

  // ==========================================================
  // MARK ALL NOTIFICATIONS AS READ
  // ==========================================================

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      await axios.patch(
        `${API_URL}/notifications/read-all`,
        {},
        {
          withCredentials: true,
        },
      );
    },

    onSuccess: () => {
      // Update notification cache

      queryClient.setQueryData(
        ["user-notifications"],
        (oldNotifications = []) =>
          oldNotifications.map((notification) => ({
            ...notification,
            isRead: true,
          })),
      );

      // Reset unread count

      queryClient.setQueryData(
        ["user-notifications", "unread-count"],
        0,
      );

      previousUnreadCountRef.current = 0;
    },

    onError: (error) => {
      console.error(
        "Failed to mark all notifications as read:",
        error,
      );
    },
  });

  // ==========================================================
  // DELETE NOTIFICATION
  // ==========================================================

  const deleteNotificationMutation = useMutation({
    mutationFn: async ({ notificationId }) => {
      await axios.delete(
        `${API_URL}/notifications/${notificationId}`,
        {
          withCredentials: true,
        },
      );

      return notificationId;
    },

    onSuccess: (notificationId) => {
      // Find deleted notification

      const currentNotifications =
        queryClient.getQueryData([
          "user-notifications",
        ]) || [];

      const deletedNotification =
        currentNotifications.find(
          (notification) =>
            notification._id === notificationId,
        );

      // Remove notification

      queryClient.setQueryData(
        ["user-notifications"],
        (oldNotifications = []) =>
          oldNotifications.filter(
            (notification) =>
              notification._id !== notificationId,
          ),
      );

      // Decrease unread count if necessary

      if (
        deletedNotification &&
        !deletedNotification.isRead
      ) {
        queryClient.setQueryData(
          ["user-notifications", "unread-count"],
          (oldCount = 0) =>
            Math.max(oldCount - 1, 0),
        );

        previousUnreadCountRef.current = Math.max(
          previousUnreadCountRef.current ?? 0,
          0,
        );
      }
    },

    onError: (error) => {
      console.error(
        "Failed to delete notification:",
        error,
      );
    },
  });

  // ==========================================================
  // OUTSIDE CLICK
  // ==========================================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, []);

  // ==========================================================
  // NOTIFICATION ICON
  // ==========================================================

  const getNotificationIcon = (type) => {
    switch (type) {
      // ------------------------------------------
      // BOOKING SUBMITTED
      // ------------------------------------------

      case "booking_submitted":
        return (
          <Send className="h-4 w-4" />
        );

      // ------------------------------------------
      // BOOKING CONFIRMED
      // ------------------------------------------

      case "booking_confirmed":
        return (
          <CircleCheck className="h-4 w-4" />
        );

      // ------------------------------------------
      // BOOKING CANCELLED
      // ------------------------------------------

      case "booking_cancelled":
        return (
          <XCircle className="h-4 w-4" />
        );

      // ------------------------------------------
      // REVIEW SUBMITTED
      // ------------------------------------------

      case "review_submitted":
        return (
          <Star className="h-4 w-4" />
        );

      // ------------------------------------------
      // REVIEW PUBLISHED
      // ------------------------------------------

      case "review_published":
        return (
          <Star className="h-4 w-4" />
        );

      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  // ==========================================================
  // NOTIFICATION ICON COLOR
  // ==========================================================

  const getNotificationIconClass = (type) => {
    switch (type) {
      case "booking_submitted":
        return "bg-info/10 text-info";

      case "booking_confirmed":
        return "bg-success/10 text-success";

      case "booking_cancelled":
        return "bg-error/10 text-error";

      case "review_submitted":
        return "bg-warning/10 text-warning";

      case "review_published":
        return "bg-primary/10 text-primary";

      default:
        return "bg-primary/10 text-primary";
    }
  };

  // ==========================================================
  // GET NOTIFICATION ROUTE
  // ==========================================================

  const getNotificationRoute = (type) => {
    switch (type) {
      case "booking_submitted":
        return "/dashboard/bookings";

      case "booking_confirmed":
        return "/dashboard/bookings";

      case "booking_cancelled":
        return "/dashboard/bookings";

      case "review_submitted":
        return "/dashboard/reviews";

      case "review_published":
        return "/dashboard/reviews";

      default:
        return null;
    }
  };

  // ==========================================================
  // GET VIEW LABEL
  // ==========================================================

  const getNotificationViewLabel = (type) => {
    switch (type) {
      case "booking_submitted":
        return "View booking";

      case "booking_confirmed":
        return "View booking";

      case "booking_cancelled":
        return "View booking";

      case "review_submitted":
        return "View review";

      case "review_published":
        return "View review";

      default:
        return "Notification";
    }
  };

  // ==========================================================
  // HANDLE NOTIFICATION CLICK
  // ==========================================================

  const handleNotificationClick = (notification) => {
    // Mark as read

    if (
      !notification.isRead &&
      !markAsReadMutation.isPending
    ) {
      markAsReadMutation.mutate(
        notification._id,
      );
    }

    // Get route

    const route = getNotificationRoute(
      notification.type,
    );

    // Close dropdown

    setOpen(false);

    // Navigate

    if (route) {
      navigate(route);
    }
  };

  // ==========================================================
  // HANDLE DELETE
  // ==========================================================

  const handleDeleteNotification = (
    event,
    notification,
  ) => {
    event.stopPropagation();

    if (deleteNotificationMutation.isPending) {
      return;
    }

    deleteNotificationMutation.mutate({
      notificationId: notification._id,
    });
  };

  // ==========================================================
  // HANDLE MARK ALL AS READ
  // ==========================================================

  const handleMarkAllAsRead = () => {
    if (
      unreadCount > 0 &&
      !markAllAsReadMutation.isPending
    ) {
      markAllAsReadMutation.mutate();
    }
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div
      ref={dropdownRef}
      className="relative"
    >
      {/* ====================================================
          BELL BUTTON
      ==================================================== */}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Notifications"
        data-tip="Notifications"
        className="
          tooltip
          tooltip-left
          relative
          flex
          h-10
          w-10
          cursor-pointer
          items-center
          justify-center
          rounded-full
          text-base-content/70
          transition-all
          duration-200
          hover:bg-primary/10
          hover:text-primary
        "
      >
        <Bell className="h-5 w-5" />

        {/* UNREAD BADGE */}

        {unreadCount > 0 && (
          <span
            className="
              absolute
              -right-0.5
              -top-0.5
              flex
              min-h-4
              min-w-4
              items-center
              justify-center
              rounded-full
              bg-error
              px-1
              text-[9px]
              font-bold
              leading-none
              text-error-content
              ring-2
              ring-base-100
            "
          >
            {unreadCount > 99
              ? "99+"
              : unreadCount}
          </span>
        )}
      </button>

      {/* ====================================================
          NOTIFICATION DROPDOWN
      ==================================================== */}

      {open && (
        <div
          className="
            absolute
            right-0
            top-12
            z-[100]
            w-[350px]
            max-w-[calc(100vw-1.5rem)]
            overflow-hidden
            rounded-2xl
            border
            border-base-300
            bg-base-100
            shadow-2xl
          "
        >
          {/* ==================================================
              HEADER
          ================================================== */}

          <div
            className="
              flex
              items-center
              justify-between
              gap-3
              border-b
              border-base-300
              px-4
              py-3
            "
          >
            <div className="min-w-0">
              <h3 className="font-semibold text-base-content">
                Notifications
              </h3>

              {unreadCount > 0 && (
                <p className="mt-0.5 text-xs text-base-content/50">
                  {unreadCount} unread notification
                  {unreadCount > 1 ? "s" : ""}
                </p>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                disabled={
                  markAllAsReadMutation.isPending
                }
                className="
                  flex
                  shrink-0
                  cursor-pointer
                  items-center
                  gap-1
                  text-xs
                  font-medium
                  text-primary
                  transition
                  hover:opacity-70
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                <CheckCheck className="h-4 w-4" />

                {markAllAsReadMutation.isPending
                  ? "Marking..."
                  : "Mark all as read"}
              </button>
            )}
          </div>

          {/* ==================================================
              NOTIFICATION LIST
          ================================================== */}

          <div
            className="
              max-h-[420px]
              overflow-y-auto
              overscroll-contain
              scrollbar-thin
              scrollbar-thumb-base-300
              scrollbar-track-transparent
            "
          >
            {/* =================================================
                LOADING
            ================================================= */}

            {notificationsLoading ? (
              <>
                <NotificationSkeleton />
                <NotificationSkeleton />
                <NotificationSkeleton />
                <NotificationSkeleton />
                <NotificationSkeleton />
              </>
            ) : notificationsError ? (
              /* =================================================
                  ERROR
              ================================================= */

              <div className="px-5 py-12 text-center">
                <Bell className="mx-auto mb-3 h-8 w-8 text-error/40" />

                <p className="text-sm font-medium text-base-content/60">
                  Failed to load notifications
                </p>

                <button
                  type="button"
                  onClick={() =>
                    queryClient.invalidateQueries({
                      queryKey: ["user-notifications"],
                    })
                  }
                  className="
                    mt-3
                    cursor-pointer
                    rounded-lg
                    bg-primary/10
                    px-3
                    py-2
                    text-xs
                    font-medium
                    text-primary
                    transition
                    hover:bg-primary/20
                  "
                >
                  Try again
                </button>
              </div>
            ) : notifications.length === 0 ? (
              /* =================================================
                  EMPTY STATE
              ================================================= */

              <div className="px-5 py-12 text-center">
                <Bell className="mx-auto mb-3 h-8 w-8 text-base-content/20" />

                <p className="text-sm font-medium text-base-content/60">
                  No notifications
                </p>

                <p className="mt-1 text-xs text-base-content/40">
                  You're all caught up!
                </p>
              </div>
            ) : (
              /* =================================================
                  NOTIFICATION ITEMS
              ================================================= */

              notifications.map((notification) => {
                const route =
                  getNotificationRoute(
                    notification.type,
                  );

                const isDeleting =
                  deleteNotificationMutation.isPending &&
                  deleteNotificationMutation
                    .variables
                    ?.notificationId ===
                    notification._id;

                return (
                  <div
                    key={notification._id}
                    onClick={() =>
                      handleNotificationClick(
                        notification,
                      )
                    }
                    title={
                      route
                        ? getNotificationViewLabel(
                            notification.type,
                          )
                        : "Notification"
                    }
                    className={`
                      group
                      flex
                      cursor-pointer
                      gap-3
                      border-b
                      border-base-200
                      px-4
                      py-3
                      transition
                      hover:bg-base-200/60

                      ${
                        !notification.isRead
                          ? "bg-primary/5"
                          : ""
                      }

                      ${
                        isDeleting
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    `}
                  >
                    {/* =================================================
                        ICON
                    ================================================= */}

                    <div
                      className={`
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-full

                        ${getNotificationIconClass(
                          notification.type,
                        )}
                      `}
                    >
                      {getNotificationIcon(
                        notification.type,
                      )}
                    </div>

                    {/* =================================================
                        CONTENT
                    ================================================= */}

                    <div className="min-w-0 flex-1">
                      {/* TITLE + DELETE */}

                      <div className="flex items-start justify-between gap-2">
                        <h4
                          className={`
                            min-w-0
                            flex-1
                            text-sm

                            ${
                              !notification.isRead
                                ? "font-semibold"
                                : "font-medium"
                            }
                          `}
                        >
                          {notification.title}
                        </h4>

                        {/* DELETE BUTTON */}

                        <button
                          type="button"
                          onClick={(event) =>
                            handleDeleteNotification(
                              event,
                              notification,
                            )
                          }
                          disabled={isDeleting}
                          aria-label="Delete notification"
                          data-tip={
                            isDeleting
                              ? "Deleting..."
                              : "Delete notification"
                          }
                          className="
                            tooltip
                            tooltip-left
                            flex
                            h-7
                            w-7
                            shrink-0
                            cursor-pointer
                            items-center
                            justify-center
                            rounded-md
                            text-base-content/30
                            opacity-0
                            transition-all
                            duration-200
                            hover:bg-error/10
                            hover:text-error
                            group-hover:opacity-100
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                          "
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>

                        {/* UNREAD DOT */}

                        {!notification.isRead && (
                          <span
                            className="
                              mt-1
                              h-2
                              w-2
                              shrink-0
                              rounded-full
                              bg-primary
                            "
                          />
                        )}
                      </div>

                      {/* MESSAGE */}

                      <p
                        className="
                          mt-1
                          text-xs
                          leading-relaxed
                          text-base-content/60
                        "
                      >
                        {notification.message}
                      </p>

                      {/* TIME */}

                      <div
                        className="
                          mt-2
                          flex
                          items-center
                          gap-1
                          text-[11px]
                          text-base-content/40
                        "
                      >
                        {formatTimeAgo(
                          notification.createdAt,
                        )}

                        {notification.isRead && (
                          <>
                            <span>•</span>

                            <Check className="h-3 w-3" />

                            <span>Read</span>
                          </>
                        )}

                        {/* ROUTE INDICATOR */}

                        {route && (
                          <>
                            <span>•</span>

                            <span className="text-primary/70">
                              View
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* ==================================================
              FOOTER
          ================================================== */}

          {notifications.length > 0 && (
            <div
              className="
                border-t
                border-base-300
                px-4
                py-2
              "
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="
                  w-full
                  cursor-pointer
                  rounded-lg
                  py-2
                  text-xs
                  font-medium
                  text-primary
                  transition
                  hover:bg-primary/10
                "
              >
                Close
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserNotificationBell;