import { CalendarDays, DollarSign, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router";
import StatCard from "../../components/dashboard/StatCard";
import SectionHeader from "../../components/dashboard/SectionHeader";
import BookingStatusBadge from "../../components/dashboard/BookingStatusBadge";

const stats = [
  {
    label: "Total Users",
    value: "1,248",
    description: "+6.4% growth from last month",
    icon: Users,
  },
  {
    label: "Total Bookings",
    value: "386",
    description: "42 bookings added this month",
    icon: CalendarDays,
  },
  {
    label: "Total Revenue",
    value: "৳12,84,000",
    description: "Monthly revenue trend remains healthy",
    icon: DollarSign,
  },
  {
    label: "Pending Bookings",
    value: "29",
    description: "Requires confirmation and follow-up",
    icon: TrendingUp,
  },
];

const bookingBars = [
  { month: "Jan", value: 48 },
  { month: "Feb", value: 56 },
  { month: "Mar", value: 62 },
  { month: "Apr", value: 71 },
  { month: "May", value: 67 },
  { month: "Jun", value: 79 },
];

const revenueBars = [
  { month: "Jan", value: 42 },
  { month: "Feb", value: 48 },
  { month: "Mar", value: 55 },
  { month: "Apr", value: 63 },
  { month: "May", value: 60 },
  { month: "Jun", value: 74 },
];

const recentBookings = [
  { customer: "Sabbir Hossain", packageName: "Premium Wedding Story", date: "2026-08-12", status: "Confirmed", payment: "Paid" },
  { customer: "Nusrat Jahan", packageName: "Family Outdoor Session", date: "2026-08-19", status: "Pending", payment: "Unpaid" },
  { customer: "Rahim Uddin", packageName: "Corporate Portrait", date: "2026-07-30", status: "Completed", payment: "Paid" },
];

const recentUsers = [
  { name: "Mariam Akter", email: "mariam@example.com", role: "user", joinedDate: "2026-07-28", profilePhoto: "" },
  { name: "Tanvir Hasan", email: "tanvir@example.com", role: "user", joinedDate: "2026-07-25", profilePhoto: "" },
  { name: "Admin Team", email: "admin@rupdarpon.com", role: "admin", joinedDate: "2026-07-20", profilePhoto: "" },
];

const recentReviews = [
  { customer: "Sadia Rahman", rating: 5, review: "Amazing storytelling and perfect color tones.", date: "2026-07-30", status: "Published" },
  { customer: "Imran Ahmed", rating: 4, review: "Great support and smooth booking process.", date: "2026-07-29", status: "Published" },
  { customer: "Nabila Sultana", rating: 3, review: "Service was good, but delivery could be faster.", date: "2026-07-27", status: "Pending" },
];

const BarPlaceholder = ({ title, description, bars }) => (
  <section className="rounded-2xl border border-primary/10 bg-base-100 p-6 shadow-sm">
    <SectionHeader title={title} description={description} />
    <div className="grid grid-cols-6 items-end gap-3 rounded-2xl border border-primary/10 bg-base-200/40 p-4 sm:p-5">
      {bars.map((bar) => (
        <div key={bar.month} className="flex flex-col items-center gap-2">
          <div className="flex h-44 w-full items-end justify-center rounded-lg bg-base-100 p-1">
            <div className="w-full rounded-md bg-primary/80" style={{ height: `${bar.value}%` }} />
          </div>
          <span className="text-xs font-semibold text-base-content/70">{bar.month}</span>
        </div>
      ))}
    </div>
  </section> 
);

const AdminDashboard = () => {
  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-primary/15 bg-base-100 p-6 shadow-sm">
        <h2 className="font-playfair text-3xl font-semibold">Welcome back, Admin</h2>
        <p className="mt-2 text-sm text-base-content/75">
          Manage your Rup Darpon platform.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <BarPlaceholder
          title="Booking Analytics"
          description="Monthly bookings overview (mock data placeholder)."
          bars={bookingBars}
        />
        <BarPlaceholder
          title="Revenue Analytics"
          description="Monthly revenue trend (mock data placeholder)."
          bars={revenueBars}
        />
      </section>

      <section className="rounded-2xl border border-primary/10 bg-base-100 p-6 shadow-sm">
        <SectionHeader
          title="Recent Bookings"
          description="Latest customer booking activity."
          actionLabel="View All Bookings"
          actionTo="/admin/bookings"
        />
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr className="text-base-content/65">
                <th>Customer</th>
                <th>Package</th>
                <th>Date</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((booking) => (
                <tr key={`${booking.customer}-${booking.date}`}>
                  <td className="font-semibold">{booking.customer}</td>
                  <td>{booking.packageName}</td>
                  <td>{booking.date}</td>
                  <td>
                    <BookingStatusBadge status={booking.status} />
                  </td>
                  <td>
                    <BookingStatusBadge status={booking.payment} />
                  </td>
                  <td>
                    <Link to="/admin/bookings" className="btn btn-ghost btn-xs hover:text-primary">
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-primary/10 bg-base-100 p-6 shadow-sm">
          <SectionHeader
            title="Recent Users"
            description="Newly registered users."
            actionLabel="View All Users"
            actionTo="/admin/users"
          />
          <div className="space-y-3">
            {recentUsers.map((item) => (
              <article key={item.email} className="flex items-center gap-3 rounded-xl border border-primary/10 p-3">
                <div className="avatar">
                  <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary">
                    {item.profilePhoto ? (
                      <img src={item.profilePhoto} alt={item.name} />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center font-semibold">
                        {item.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{item.name}</p>
                  <p className="truncate text-xs text-base-content/70">{item.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-wide text-primary">{item.role}</p>
                  <p className="text-xs text-base-content/65">{item.joinedDate}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-primary/10 bg-base-100 p-6 shadow-sm">
          <SectionHeader title="Recent Reviews" description="Latest customer feedback." />
          <div className="space-y-3">
            {recentReviews.map((item) => (
              <article key={`${item.customer}-${item.date}`} className="rounded-xl border border-primary/10 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold">{item.customer}</p>
                  <p className="text-xs text-base-content/65">{item.date}</p>
                </div>
                <p className="mt-2 text-xs uppercase tracking-wide text-primary">
                  Rating: {item.rating}/5
                </p>
                <p className="mt-2 text-sm text-base-content/75">{item.review}</p>
                <div className="mt-3">
                  <BookingStatusBadge status={item.status} />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
