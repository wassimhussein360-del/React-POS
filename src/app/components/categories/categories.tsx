import { Chevron } from "@/assets/icons";
import SingleCategoryCard from "./singleCategoryCard";
import allCategoriesIcon from "@/assets/images/categories.png";
import { useEffect, useState } from "react";
import { Category, Item } from "@/app/abstraction/types";
import FirestoreService from "@/servies/firestoreService";

const Categories: React.FC<{ products: Item[] }> = ({ products }) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (products.length) {
      FirestoreService.getSubcollection("vendors", "UVCVz6a9GWLzuRGnGVfx", "categories").then(
        (fetchedCategories) => {
          const formattedCategories: Category[] = formatCategories(fetchedCategories, products);
          setCategories(formattedCategories);
        }
      );
    }
  }, [products]);

  return (
    <article className="">
      <section className="flex justify-between items-center mb-4">
        <aside>
          <h4 className="font-semibold">Categories</h4>
          <p className="text-sm text-gray-500">Select From Below Categories</p>
        </aside>
        <aside className="flex gap-4">
          <Chevron className="  rotate-90 w-4 h-4 cursor-pointer" />
          <Chevron className=" -rotate-90 w-4 h-4 cursor-pointer" />
        </aside>
      </section>

      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6    gap-5 ">
        <SingleCategoryCard
          category={{
            name: "All Categories",
            quantity: products.length,
            image: "",
          }}
        />
        {categories.map((cat, i) => {
          return <SingleCategoryCard key={i} category={cat} className={""} />;
        })}
      </section>
    </article>
  );
};

export default Categories;

function formatCategories(categories: any[], allProducts: Item[]): Category[] {
  return categories
    .filter((cat) => cat.active)
    .filter((cat) => {
      const relatedProducts = allProducts.filter((pr) => pr.categoryId.includes(cat.id));
      return relatedProducts.length > 0;
    })
    .map((cat) => {
      const relatedProducts = allProducts.filter((pr) => pr.categoryId.includes(cat.id));
      return {
        id: cat.id,
        name: cat.name.en,
        image: cat.images?.length ? cat.images[0].url : "",
        quantity: relatedProducts.length,
        products: relatedProducts,
      };
    });
}
