import { Chevron } from "@/assets/icons";
import SingleCategoryCard from "./singleCategoryCard";
import allCategoriesIcon from "@/assets/images/categories.png";

const Categories: React.FC<any> = ({}) => {
  const totalCategories = () => {
    const quantities = categories.map((cat) => cat.quantity);
    return quantities.reduce((sum, quantity) => sum + quantity);
  };
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
            quantity: totalCategories(),
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

const categories = [
  {
    name: "Boukhour",
    image:
      "https://daralsmow.com/wp-content/uploads/2023/03/%D8%A8%D8%AE%D9%88%D8%B1-%D8%A7%D9%84%D9%88%D8%B1%D8%AF-%D8%A7%D9%84%D8%B7%D8%A7%D8%A6%D9%81%D9%8A-%D9%85%D8%B9-%D9%85%D9%83%D9%88%D9%86%D8%A7%D8%AA.jpg",
    quantity: 120,
  },
  {
    name: "Perfumes",
    image:
      "https://static.vecteezy.com/system/resources/previews/035/940/256/non_2x/ai-generated-perfume-glass-isolated-on-transparent-background-free-png.png",
    quantity: 200,
  },
  {
    name: "Mubkhars",
    image:
      "https://daralteeb.com.kw/wp-content/uploads/2020/03/Hair-Brazier-Black-e1584383449412.jpg",
    quantity: 150,
  },
  {
    name: "Oud",
    image: "https://www.cotebougie.com/blog/wp-content/uploads/2022/03/diffuseur-oud-1.jpg",
    quantity: 80,
  },
];
