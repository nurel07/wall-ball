import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminWallpaperItem from "@/components/AdminWallpaperItem";
import SignOutButton from "@/components/SignOutButton";

export default async function AdminDashboard() {
    const session = await auth();
    console.log("Admin Dashboard Session:", JSON.stringify(session, null, 2));
    if (!session) {
        redirect("/login");
    }
    const wallpapers = await prisma.wallpaper.findMany({
        orderBy: { releaseDate: "desc" },
    });

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    <p className="text-sm text-gray-500">Logged in as: {session?.user?.name}</p>
                </div>
                <div className="flex gap-4">
                    <Link
                        href="/admin/upload"
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        Upload New Wallpaper
                    </Link>
                    <SignOutButton />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wallpapers.map((wallpaper) => (
                    <AdminWallpaperItem key={wallpaper.id} wallpaper={wallpaper} />
                ))}
            </div>
            <div className="mt-8 text-center text-gray-500 text-sm">
                Admin Dashboard v1.1 (Auth Check Active)
            </div>
        </div>
    );
}
