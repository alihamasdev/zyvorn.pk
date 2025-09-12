import { getCategories } from "@/lib/dal";
import { CategoryList } from "@/components/pages/dashboard/categories/category-card";

export default function CategoriesPage() {
	const dataPromise = getCategories();

	return <CategoryList dataPromise={dataPromise} />;
}
