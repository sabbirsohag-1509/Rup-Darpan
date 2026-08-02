import { LockKeyhole } from "lucide-react";

const DashboardPlaceholderPage = ({ title, description }) => {
  return (
    <section className="rounded-2xl border border-primary/10 bg-base-100 p-8 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <LockKeyhole className="h-5 w-5" />
      </div>
      <h2 className="font-playfair text-2xl font-semibold">{title}</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm text-base-content/70">{description}</p>
    </section>
  );
};

export default DashboardPlaceholderPage;
