import { prisma } from "@/lib/prisma";
import { format } from "date-fns";

export const revalidate = 60; // Revalidate every minute

export default async function Home() {
  const wallpapers = await prisma.wallpaper.findMany({
    where: {
      releaseDate: {
        lte: new Date(),
      },
    },
    orderBy: {
      releaseDate: "desc",
    },
  });

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold text-center mb-12">Wallpapers</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {wallpapers.map((wallpaper) => (
          <div
            key={wallpaper.id}
            className="group relative aspect-[16/10] overflow-hidden rounded-xl shadow-lg cursor-pointer"
          >
            <img
              src={wallpaper.url}
              alt={wallpaper.description || "Wallpaper"}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
              <p className="text-white text-lg font-medium">
                {wallpaper.description}
              </p>
              <p className="text-gray-300 text-sm mt-2">
                {format(wallpaper.releaseDate, "MMMM d, yyyy")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
