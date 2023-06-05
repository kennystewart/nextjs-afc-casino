import Guides from "@/components/Guides";
import Link from "next/link";

export default async function Page() {
  return (
    <div className="md:container mx-auto text-sky-700 dark:text-white">
      <div className="py-6 px-1 mt-28">
        <div className="container mx-auto">
          <div className="flex text-sm gap-1 font-medium  items-center md:gap-4">
            <span>
              <Link href="/">AFC Home</Link> / Guides
            </span>
          </div>
        </div>
      </div>
      <Guides />
    </div>
  );
}
