import React from "react";

interface MasonryGridProps {
    children: React.ReactNode;
    className?: string;
    gap?: string;
}

export default function MasonryGrid({ children, className = "", gap = "gap-6 space-y-6" }: MasonryGridProps) {
    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${gap} ${className}`}>
            {React.Children.map(children, (child) => (
                <div className="w-full">
                    {child}
                </div>
            ))}
        </div>
    );
}
