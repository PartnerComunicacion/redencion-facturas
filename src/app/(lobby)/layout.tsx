import SiteHeader from '@/components/site-header';

interface DashboardLayoutProps {
	children: React.ReactNode;
}

export default function HomeLayout({ children }: DashboardLayoutProps) {
	return (
		<div className="flex min-h-screen">
			<SiteHeader />
			<main className="flex w-full flex-col">{children}</main>
		</div>
	);
}
