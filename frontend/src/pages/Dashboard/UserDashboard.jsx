import { CalendarDays, Camera, MapPin, MessageSquareText, Star, Clock3 } from "lucide-react";
import { Link } from "react-router";
import StatCard from "../../components/dashboard/StatCard";
import SectionHeader from "../../components/dashboard/SectionHeader";
import BookingStatusBadge from "../../components/dashboard/BookingStatusBadge";
import EmptyState from "../../components/dashboard/EmptyState";
import QuickActionCard from "../../components/dashboard/QuickActionCard";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const stats = [
  {
    label: "Total Bookings",
    value: "14",
    description: "Total sessions booked across all packages.",
    icon: CalendarDays,
  },
  {
    label: "Upcoming Sessions",
    value: "2",
    description: "Sessions scheduled in the coming weeks.",
    icon: Clock3,
  },
  {
    label: "Completed Sessions",
    value: "11",
    description: "Successfully delivered photography sessions.",
    icon: Camera,
  },
  {
    label: "Reviews Given",
    value: "8",
    description: "Reviews shared for your recent experiences.",
    icon: MessageSquareText,
  },
];

const upcomingBooking = {
  packageName: "Premium Wedding Story",
  date: "2026-08-12",
  time: "10:00 AM",
  location: "Dhaka, Bangladesh",
  bookingStatus: "Confirmed",
  paymentStatus: "Paid",
};

const recentBookings = [
  { id: "RD-2831", packageName: "Classic Portrait Session", date: "2026-07-20", status: "Completed", payment: "Paid" },
  { id: "RD-2920", packageName: "Premium Wedding Story", date: "2026-08-12", status: "Confirmed", payment: "Paid" },
  { id: "RD-2977", packageName: "Family Outdoor Session", date: "2026-08-28", status: "Pending", payment: "Unpaid" },
  { id: "RD-2689", packageName: "Couple Session", date: "2026-06-03", status: "Cancelled", payment: "Unpaid" },
];

const recentReviews = [
  {
    service: "Classic Portrait Session",
    rating: 5,
    review: "Very professional team and beautifully edited photos.",
    date: "2026-07-23",
  },
  {
    service: "Couple Session",
    rating: 4,
    review: "Great direction during the shoot and quick delivery.",
    date: "2026-06-09",
  },
];

const quickActions = [
  {
    to: "/packages",
    title: "Book a Session",
    description: "Choose your next photography package.",
    icon: CalendarDays,
  },
  {
    to: "/gallery",
    title: "Browse Gallery",
    description: "Explore recent visual storytelling work.",
    icon: Camera,
  },
  {
    to: "/dashboard/bookings",
    title: "My Bookings",
    description: "Review all upcoming and past sessions.",
    icon: Clock3,
  },
  {
    to: "/dashboard/reviews",
    title: "Write a Review",
    description: "Share feedback from your latest session.",
    icon: Star,
  },
  {
    to: "/dashboard/profile",
    title: "Edit Profile",
    description: "Keep your account details up to date.",
    icon: MessageSquareText,
  },
];

const UserDashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-primary/15 bg-base-100 p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="avatar">
            <div className="h-16 w-16 rounded-2xl ring-1 ring-primary/30 ring-offset-2 ring-offset-base-100">
              {user?.profilePhoto ? (
                <img src={user.profilePhoto} alt={user.name} />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary/10 text-xl font-semibold text-primary">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>

          <div>
            <h2 className="font-playfair text-3xl font-semibold">Welcome back, {user?.name}</h2>
            <p className="mt-1 text-sm text-base-content/70">{user?.email}</p>
            <p className="mt-2 text-sm text-base-content/75">
              Manage your bookings and photography experience from here.
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      <section className="rounded-2xl border border-primary/10 bg-base-100 p-6 shadow-sm">
        <SectionHeader
          title="Upcoming Booking"
          description="Your nearest scheduled photography session."
        />
        {upcomingBooking ? (
          <div className="rounded-2xl border border-primary/15 bg-base-200/50 p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold">{upcomingBooking.packageName}</h3>
                <div className="mt-3 space-y-2 text-sm text-base-content/80">
                  <p className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-primary" />
                    {upcomingBooking.date}
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock3 className="h-4 w-4 text-primary" />
                    {upcomingBooking.time}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    {upcomingBooking.location}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <BookingStatusBadge status={upcomingBooking.bookingStatus} />
                <BookingStatusBadge status={upcomingBooking.paymentStatus} />
              </div>
            </div>

            <Link to="/dashboard/bookings" className="btn btn-primary mt-5 text-primary-content">
              View Details
            </Link>
          </div>
        ) : (
          <EmptyState
            icon={CalendarDays}
            title="No upcoming bookings"
            description="Explore our photography packages and book your next session."
            actionText="Explore Packages"
            actionTo="/packages"
          />
        )}
      </section>

      <section className="rounded-2xl border border-primary/10 bg-base-100 p-6 shadow-sm">
        <SectionHeader title="Recent Bookings" description="Your latest booking activity." />
        <div className="hidden overflow-x-auto md:block">
          <table className="table">
            <thead>
              <tr className="text-base-content/65">
                <th>Booking ID</th>
                <th>Package</th>
                <th>Date</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="font-semibold">{booking.id}</td>
                  <td>{booking.packageName}</td>
                  <td>{booking.date}</td>
                  <td>
                    <BookingStatusBadge status={booking.status} />
                  </td>
                  <td>
                    <BookingStatusBadge status={booking.payment} />
                  </td>
                  <td>
                    <Link to="/dashboard/bookings" className="btn btn-ghost btn-xs hover:text-primary">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-3 md:hidden">
          {recentBookings.map((booking) => (
            <div key={booking.id} className="rounded-xl border border-primary/10 bg-base-100 p-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-semibold">{booking.id}</p>
                <BookingStatusBadge status={booking.status} />
              </div>
              <p className="text-sm">{booking.packageName}</p>
              <p className="mt-1 text-xs text-base-content/70">{booking.date}</p>
              <div className="mt-3 flex items-center justify-between">
                <BookingStatusBadge status={booking.payment} />
                <Link to="/dashboard/bookings" className="text-sm font-semibold text-primary">
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-primary/10 bg-base-100 p-6 shadow-sm">
        <SectionHeader title="Quick Actions" description="Go to frequently used sections." />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {quickActions.map((action) => (
            <QuickActionCard key={action.title} {...action} />
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-primary/10 bg-base-100 p-6 shadow-sm">
        <SectionHeader title="Recent Reviews" description="Your latest submitted feedback." />
        {recentReviews.length > 0 ? (
          <div className="space-y-3">
            {recentReviews.map((review) => (
              <article key={`${review.service}-${review.date}`} className="rounded-xl border border-primary/10 bg-base-100 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold">{review.service}</h3>
                  <p className="text-xs text-base-content/65">{review.date}</p>
                </div>
                <p className="mt-2 flex items-center gap-1 text-sm text-warning">
                  {Array.from({ length: review.rating }).map((_, idx) => (
                    <Star key={idx} className="h-4 w-4 fill-current" />
                  ))}
                </p>
                <p className="mt-2 text-sm text-base-content/75">{review.review}</p>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={MessageSquareText}
            title="No reviews yet"
            description="You have not submitted any reviews yet."
          />
        )}
      </section>
    </div>
  );
};

export default UserDashboard;
