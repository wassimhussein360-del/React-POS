import { Chevron } from "@/assets/icons";
import SingleCategoryCard from "./singleCategoryCard";
import allCategoriesIcon from "@/assets/images/categories.png";
import { useEffect, useState } from "react";
import { Category, Item } from "@/app/abstraction/types";
import FirestoreService from "@/servies/firestoreService";
import CategorySkeleton from "./categorySkeletone";
import { useCart, useGeneral, useVendor } from "@/reduxStore/hooks";
import { formatProducts } from "../products/products";
import { Spinner } from "@material-tailwind/react";
import { useDispatch } from "react-redux";
import { SetCartField } from "@/reduxStore/slices/cartSlice";
import { SetGeneralField } from "@/reduxStore/slices/generalSlice";
import { $translate } from "@/app/helpers/helpers";

const Categories: React.FC<{
  products: Item[];
  setProducts: Function;
  setAllProducts: Function;
}> = ({ products, setProducts, setAllProducts }) => {
  const dispatch = useDispatch();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const vendor = useVendor();
  const $cart = useCart();
  const $general = useGeneral();

  useEffect(() => {
    if (products.length && vendor) {
      FirestoreService.getSubcollection("vendors", vendor.id, "categories").then(
        (fetchedCategories) => {
          const formattedCategories: Category[] = formatCategories(fetchedCategories, products);

          setCategories(formattedCategories);
        }
      );
    }
  }, [products]);

  useEffect(() => {
    if (vendor?.id && $general.branch?.id) {
      setCategories([]);
      setSelectedCategory("all");
      // Fetch Products related to selected vendor

      FirestoreService.getSubcollection("vendors", vendor.id, "products").then(
        (fetchedProducts) => {
          const formattedProducts = formatProducts(fetchedProducts, $general.branch.id);

          setAllProducts(formattedProducts);
          setProducts(formattedProducts);

          dispatch(SetGeneralField({ field: "products", value: formattedProducts }));
        }
      );
    }
  }, [vendor, $general.branch]);

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category.id);

    setProducts(category.products);
  };

  return (
    <article className="">
      <section className="flex justify-between items-center mb-4">
        <aside>
          <h4 className="font-semibold">Categories</h4>
          <p className="text-sm text-gray-500">Select From Below Categories</p>
        </aside>
        {/* <aside className="flex gap-4">
          <Chevron className="  rotate-90 w-4 h-4 cursor-pointer" />
          <Chevron className=" -rotate-90 w-4 h-4 cursor-pointer" />
        </aside> */}
      </section>

      <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6   gap-5 ">
        {categories.length ? (
          <>
            <SingleCategoryCard
              className={
                selectedCategory === "all"
                  ? "border-secondary shadow-xl border-2"
                  : "cursor-pointer"
              }
              category={{
                name: "All Categories",
                quantity: products.length,
                image: "",
              }}
              onClick={() => {
                setSelectedCategory("all");
                setProducts(products);
              }}
            />
            {categories.map((cat, i) => {
              return (
                <SingleCategoryCard
                  key={i}
                  category={cat}
                  className={
                    selectedCategory === cat.id
                      ? "border-secondary shadow-xl border-2"
                      : "cursor-pointer"
                  }
                  onClick={() => handleCategoryClick(cat)}
                />
              );
            })}
          </>
        ) : (
          <>
            {new Array(10).fill(0).map((cat, i) => {
              return <CategorySkeleton key={i} />;
            })}
          </>
        )}
      </section>
    </article>
  );
};

export default Categories;

function formatCategories(categories: any[], allProducts: Item[]): Category[] {
  return categories
    .filter((cat) => cat.active)
    .filter((cat) => {
      const relatedProducts = allProducts.filter((pr) => {
        return pr.categoriesIds.includes(cat.id);
      });

      return relatedProducts.length > 0;
    })
    .map((cat) => {
      const relatedProducts = allProducts.filter((pr) => pr.categoriesIds.includes(cat.id));

      return {
        id: cat.id,
        name: $translate(cat.name),
        image: cat.images?.length ? cat.images[0].url : "",
        quantity: relatedProducts.length,
        products: relatedProducts,
      };
    });
}
