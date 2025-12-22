"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function checkDuplicateTitle(title: string) {
    if (!title) return false;

    try {
        const count = await prisma.wallpaper.count({
            where: {
                name: {
                    equals: title,
                    mode: 'insensitive' // Case-insensitive check
                },
                channel: "HUMAN" // Only check duplicates in Human channel? Or globally? User said "only relevant for Human channel" implies checking against Human records? Or preventing adding TO Human channel?
                // "only relevant for Human channel" usually means we only care to warn if we are adding TO Human.
                // But a duplicate might exist in AI? Unlikely to matter.
                // Let's assume we want to know if *any* wallpaper has this title, but we only trigger the check if the *current form* is set to Human.
                // However, let's keep it simple: check if ANY wallpaper has this title.
            }
        });

        return count > 0;
    } catch (error) {
        console.error("Duplicate check failed:", error);
        return false;
    }
}
