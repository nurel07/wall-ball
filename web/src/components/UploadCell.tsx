"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Loader2 } from "lucide-react";
import UploadModal from "./UploadModal";

export default function UploadCell() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploadedImageUrl, setUploadedImageUrl] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        setIsUploading(true);

        try {
            // 1. Get signature and config
            const signRes = await fetch("/api/cloudinary/sign", { method: "POST" });
            if (!signRes.ok) throw new Error("Failed to get upload signature");
            const { signature, timestamp, cloudName, apiKey } = await signRes.json();

            // 2. Upload to Cloudinary
            const formData = new FormData();
            formData.append("file", file);
            formData.append("api_key", apiKey);
            // Actually, better to just use the cloud name in the URL and signature in body
            // Let's assume we fetch cloud name or have it in env

            // Correction: We need the cloud name for the URL. 
            // Since we can't easily access server env vars here without passing them down or exposing with NEXT_PUBLIC,
            // let's assume NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is set or we hardcode/fetch it.
            // For now, I'll fetch the cloud name from the sign endpoint too or just use the one provided by user "yevgento"


            formData.append("timestamp", timestamp.toString());
            formData.append("signature", signature);
            formData.append("folder", "wallpapers");

            const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: "POST",
                body: formData,
            });

            if (!uploadRes.ok) {
                const errorData = await uploadRes.json();
                throw new Error(errorData.error?.message || "Upload failed");
            }

            const data = await uploadRes.json();
            setUploadedImageUrl(data.secure_url);
            setIsModalOpen(true);

        } catch (error: any) {
            console.error("Upload error:", error);
            alert(`Upload failed: ${error.message}`);
        } finally {
            setIsUploading(false);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': []
        },
        multiple: false,
        disabled: isUploading
    });

    return (
        <>
            <div
                {...getRootProps()}
                className={`relative w-full h-auto aspect-[16/10] bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center overflow-hidden group cursor-pointer transition-colors
                    ${isDragActive ? 'border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''}
                    ${isUploading ? 'cursor-not-allowed opacity-70' : ''}
                `}
            >
                <input {...getInputProps()} />

                {/* Visual Content */}
                <div className="flex flex-col items-center text-gray-400 group-hover:text-blue-500 transition-colors z-10">
                    {isUploading ? (
                        <Loader2 className="w-12 h-12 mb-2 animate-spin" />
                    ) : (
                        <Upload className={`w-12 h-12 mb-2 ${isDragActive ? 'animate-bounce' : ''}`} />
                    )}
                    <span className="font-medium">
                        {isUploading ? "Uploading..." : isDragActive ? "Drop it here!" : "Upload Image"}
                    </span>
                    {!isUploading && !isDragActive && (
                        <span className="text-xs mt-1 opacity-70">Drag & drop or click</span>
                    )}
                </div>
            </div>

            <UploadModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                imageUrl={uploadedImageUrl}
            />
        </>
    );
}
