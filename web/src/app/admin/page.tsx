import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";

export default async function AdminDashboard() {
    const wallpapers = await prisma.wallpaper.findMany({
        orderBy: { releaseDate: "desc" },
    });

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <Link
                    href="/admin/upload"
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    Upload New Wallpaper
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wallpapers.map((wallpaper) => (
                    <div key={wallpaper.id} className="border rounded p-4 shadow bg-white text-black">
                        <img
                            src={wallpaper.url}
                            alt={wallpaper.description || "Wallpaper"}
                            className="w-full h-48 object-cover rounded mb-4"
                        />
                        <p className="font-bold">{format(wallpaper.releaseDate, "yyyy-MM-dd")}</p>
                        <p className="text-gray-600 mb-4">{wallpaper.description}</p>
                        <div className="flex gap-2">
                            {/* TODO: Implement Edit/Delete functionality */}
                            <button className="text-blue-500 hover:underline">Edit</button>
                            <button className="text-red-500 hover:underline">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
