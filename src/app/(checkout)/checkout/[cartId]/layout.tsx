import Image from "next/image";
import Link from "next/link";

import Logo from "~/public/logo.png";

export default function CheckoutLayout({ children }: LayoutProps<"/checkout/[cartId]">) {
	return (
		<main className="flex min-h-dvh flex-col" style={{ "--ring": "var(--blue)", "--primary": "var(--blue)" } as React.CSSProperties}>
			<header className="z-50 w-full border-b">
				<div className="flex justify-center px-4 py-3">
					<Link href="/">
						<Image src={Logo} alt="logo" width={112} height={22} />
					</Link>
				</div>
			</header>
			{children}
		</main>
	);
}
