import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | ZeroAge',
  description: 'View your workout statistics and progress',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
