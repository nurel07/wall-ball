"use client";

import { useState } from "react";
import MasonryGrid from "./MasonryGrid";
import AdminWallpaperItem from "./AdminWallpaperItem";
import UploadCell from "./UploadCell";

interface Wallpaper {
    id: string;
    url: string;
    name: string | null;
    description: string | null;
    releaseDate: Date | string;
    channel?: string | null;
    externalUrl: string | null;
}

interface AdminDashboardTabsProps {
    pastWallpapers: Wallpaper[];
    futureWallpapers: Wallpaper[];
}

export default function AdminDashboardTabs({
    pastWallpapers,
    futureWallpapers,
}: AdminDashboardTabsProps) {
    // Default to sorted "Future" items if any exist, otherwise "Past"
    const [activeTab, setActiveTab] = useState<"future" | "past">(
        futureWallpapers.length > 0 ? "future" : "past"
    );

    return (
        <div>
            {/* Tabs Header */}
            <div className="flex border-b border-gray-200 mb-6">
                <button
                    onClick={() => setActiveTab("future")}
                    className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === "future"
                        ? "border-black text-black"
                        : "border-transparent text-gray-400 hover:text-gray-600"
                        }`}
                >
                    Future ({futureWallpapers.length})
                </button>
                <button
                    onClick={() => setActiveTab("past")}
                    className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === "past"
                        ? "border-black text-black"
                        : "border-transparent text-gray-400 hover:text-gray-600"
                        }`}
                >
                    Past ({pastWallpapers.length})
                </button>
            </div>

            {/* Content */}
            <div className="min-h-[500px]">
                {activeTab === "future" ? (
                    <MasonryGrid gap="gap-0 space-y-0">
                        {/* Upload Trigger always visible in Future? Or both? Usually convenient in Future/Active tab */}
                        <UploadCell />
                        {futureWallpapers.map((wallpaper) => (
                            <AdminWallpaperItem key={wallpaper.id} wallpaper={wallpaper} />
                        ))}
                        {futureWallpapers.length === 0 && (
                            <div className="col-span-full p-8 text-center text-gray-400">
                                No scheduled wallpapers.
                            </div>
                        )}
                    </MasonryGrid>
                ) : (
                    <MasonryGrid gap="gap-0 space-y-0">
                        {/* We can show UploadCell in Past too if user wants to back-fill */}
                        <UploadCell />
                        {pastWallpapers.map((wallpaper) => (
                            <AdminWallpaperItem key={wallpaper.id} wallpaper={wallpaper} />
                        ))}
                        {pastWallpapers.length === 0 && (
                            <div className="col-span-full p-8 text-center text-gray-400">
                                No past wallpapers.
                            </div>
                        )}
                    </MasonryGrid>
                )}
            </div>
        </div>
    );
}
