import type { Metadata } from "next";
import "./globals.css";
import { DropdownProvider } from "@/contexts/dropdown-context";
import { AuthProvider } from "@/contexts/auth-context";
import { AuthTokenSync } from "@/components/authTokenSync";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
	title: "DBCapibara - Database Modeling Tool",
	description: "Herramienta de modelado de bases de datos NoSQL",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="es">
			<head>
				<meta charSet="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			</head>
			<body className="font-OpenSans">
				<Toaster position="top-center" />
				<AuthProvider>
					<AuthTokenSync />
					<DropdownProvider>{children}</DropdownProvider>
				</AuthProvider>
			</body>
		</html>
	);
}
