import Link from "next/link";

const links = [
  { href: "/", label: "Tableau de bord" },
  { href: "/transactions", label: "Transactions" },
  { href: "/categories", label: "Catégories" },
  { href: "/coloc", label: "Coloc" },
];

export default function NavBar() {
  return (
    <nav className="sticky top-0 z-10 border-b bg-white">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-1 overflow-x-auto px-4 py-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
