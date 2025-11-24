import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const wallpapers = await prisma.wallpaper.findMany({
        orderBy: { releaseDate: "desc" },
    });
    return NextResponse.json(wallpapers);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { url, description, releaseDate } = body;

        const wallpaper = await prisma.wallpaper.create({
            data: {
                url,
                description,
                releaseDate: new Date(releaseDate),
            },
        });

        return NextResponse.json(wallpaper);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error creating wallpaper" }, { status: 500 });
    }
}
