import { prisma } from "@/lib/prisma";
import CategoryForm from "@/components/CategoryForm";
import CategoryList from "@/components/CategoryList";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Catégories</h1>
      <CategoryForm />
      <CategoryList categories={categories} />
    </div>
  );
}
