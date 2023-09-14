import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import TrpcProvider from '@/context/Provider';
import { AuthContextProvider } from '@/context/AuthProvider';

import { Toaster } from '@/components/ui/toaster';
import { SiteHeader } from '@/components/site-header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Redención de facturas',
	description: 'Sube tus facturas y obtén descuentos',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="es">
			<AuthContextProvider>
				<body className={inter.className}>
					<TrpcProvider>
						{/* <SiteHeader /> */}
						{children}
						<Toaster />
					</TrpcProvider>
				</body>
			</AuthContextProvider>
		</html>
	);
}
