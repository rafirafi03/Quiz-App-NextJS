import useQuiz from "@/app/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type CategoryType = {
  id: number;
  name: string;
};

const type = ["boolean", "multiple"];
const level = ["easy", "medium", "hard"];

const DropOptions = () => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  let [loading, setLoading] = useState(false);

  const addCategory = useQuiz((state) => state.addCategory);
  const addLevel = useQuiz((state) => state.addLevel);
  const addType = useQuiz((state) => state.addType);
  const config = useQuiz((state) => state.config);

  useEffect(() => {
    setLoading(false);
    async function fetchCategory() {
      try {
        const response = await fetch("https://opentdb.com/api_category.php");
        const data = await response.json();
        const { trivia_categories } = data;
        console.log(trivia_categories, "tri");

        setCategories([...trivia_categories]);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
    fetchCategory();
  }, []);

  return (
    <section className="flex justify-evenly items-center py-5 w-full">
      <div className="px-7 py-4 w-1/3 mx-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex outline-none justify-between w-full px-10 py-3 rounded-lg shadow-lg hover:bg-gray-600 hover:text-gray-100">
            {config.category.name ? config.category.name : "Category"}
            <ChevronDown />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Select Category</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {categories.slice(0, 10).map((category) => (
              <DropdownMenuItem
                className='bg-white'
                key={category.id}
                onClick={() => addCategory(category.id, category.name)}
              >
                {category.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="px-7 py-4 w-1/3 mx-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex outline-none justify-between w-full px-10 py-3 rounded-lg shadow-lg hover:bg-gray-600 hover:text-gray-100">
            {config.level ? config.level : "level"}
            <ChevronDown />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Select Level</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {level.map((e) => (
              <DropdownMenuItem className='bg-white' key={e} onClick={() => addLevel(e)}>
                {e}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="px-7 py-4 w-1/3 mx-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex outline-none justify-between w-full px-10 py-3 rounded-lg shadow-lg hover:bg-gray-600 hover:text-gray-100">
            {config.type ? config.type : "type"}
            <ChevronDown />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Select Type</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {type.map((e) => (
              <DropdownMenuItem key={e} onClick={() => addType(e)}>
                {e}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </section>
  );
};

export default DropOptions;
