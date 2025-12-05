import type { Metadata } from "next";
import "./globals.css";
import { DropdownProvider } from "@/contexts/dropdown-context";

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
				<DropdownProvider>{children}</DropdownProvider>
			</body>
		</html>
	);
}
