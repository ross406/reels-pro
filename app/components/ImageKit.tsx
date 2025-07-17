"use client" // This component must be a client component

import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
    UploadResponse,
} from "@imagekit/next";
import { Loader2 } from "lucide-react";
import { useRef, useState } from "react";

interface FileUploadProps {
    onSuccess: (url: UploadResponse) => void;
    onProgress: (progress: number) => void;
    fileType?: "image" | "video";
}


// UploadExample component demonstrates file uploading using ImageKit's Next.js SDK.
const UploadExample = ({
    onSuccess,
    onProgress,
    fileType = "image",
}:FileUploadProps) => {
    // State to keep track of the current upload progress (percentage)
    const [progress, setProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Create a ref for the file input element to access its files easily
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Create an AbortController instance to provide an option to cancel the upload if needed.
    const abortController = new AbortController();

    /**
     * Authenticates and retrieves the necessary upload credentials from the server.
     *
     * This function calls the authentication API endpoint to receive upload parameters like signature,
     * expire time, token, and publicKey.
     *
     * @returns {Promise<{signature: string, expire: string, token: string, publicKey: string}>} The authentication parameters.
     * @throws {Error} Throws an error if the authentication request fails.
     */
    const authenticator = async () => {
        try {
            // Perform the request to the upload authentication endpoint.
            const response = await fetch("/api/upload-auth");
            if (!response.ok) {
                // If the server response is not successful, extract the error text for debugging.
                const errorText = await response.text();
                throw new Error(`Request failed with status ${response.status}: ${errorText}`);
            }

            // Parse and destructure the response JSON for upload credentials.
            const data = await response.json();
            const { signature, expire, token, publicKey } = data;
            return { signature, expire, token, publicKey };
        } catch (error) {
            // Log the original error for debugging before rethrowing a new error.
            console.error("Authentication error:", error);
            throw new Error("Authentication request failed");
        }
    };

    const validateFile = (file: File): boolean => {
        const isVideo = file.type.startsWith("video/");
        const isImage = file.type.startsWith("image/");

        if (fileType === "video") {
            if (!isVideo) {
            setError("Please upload a valid video file (e.g., MP4, WebM)");
            return false;
            }
            if (file.size > 100 * 1024 * 1024) {
            setError("Video must be less than 100MB");
            return false;
            }
        } else {
            const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];
            if (!isImage || !allowedImageTypes.includes(file.type)) {
            setError("Please upload a valid image file (JPEG, PNG, or WebP)");
            return false;
            }
            if (file.size > 5 * 1024 * 1024) {
            setError("Image must be less than 5MB");
            return false;
            }
        }

        setError(null); // clear any previous errors
        return true;
    };


    /**
     * Handles the file upload process.
     *
     * This function:
     * - Validates file selection.
     * - Retrieves upload authentication credentials.
     * - Initiates the file upload via the ImageKit SDK.
     * - Updates the upload progress.
     * - Catches and processes errors accordingly.
     */
    const handleUpload = async () => {
        // Access the file input element using the ref
        const fileInput = fileInputRef.current;
        if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
            alert("Please select a file to upload");
            return;
        }

        // Extract the first file from the file input
        const file = fileInput.files[0];

        if (!validateFile(file)) {
            return;
        }

        // Retrieve authentication parameters for the upload.
        let authParams;
        try {
            authParams = await authenticator();
        } catch (authError) {
            console.error("Failed to authenticate for upload:", authError);
            return;
        }
        const { signature, expire, token, publicKey } = authParams;

        // Call the ImageKit SDK upload function with the required parameters and callbacks.
        try {
            setUploading(true);
            const uploadResponse:UploadResponse = await upload({
                // Authentication parameters
                expire,
                token,
                signature,
                publicKey,
                file,
                fileName: file.name, // Optionally set a custom file name
                folder: fileType === "video" ? "/videos" : "/images",
                // Progress callback to update upload progress state
                onProgress: (event) => {
                    setProgress((event.loaded / event.total) * 100);
                    onProgress((event.loaded / event.total) * 100);
                },
                // Abort signal to allow cancellation of the upload if needed.
                abortSignal: abortController.signal,
                // checks: "file.size' < '100MB'"
            });
            console.log("Upload response:", uploadResponse);
            setUploading(false);
            setError(null);
            onSuccess(uploadResponse);
        } catch (error) {
            // Handle specific error types provided by the ImageKit SDK.
            if (error instanceof ImageKitAbortError) {
                console.error("Upload aborted:", error.reason);
                setError(error.reason as string);
                setUploading(false);
            } else if (error instanceof ImageKitInvalidRequestError) {
                console.error("Invalid request:", error.message);
                 setError(error.message as string);
                 setUploading(false);
            } else if (error instanceof ImageKitUploadNetworkError) {
                console.error("Network error:", error.message);
                 setError(error.message as string);
                 setUploading(false);
            } else if (error instanceof ImageKitServerError) {
                console.error("Server error:", error.message);
                 setError(error.message as string);
                 setUploading(false);
            } else {
                // Handle any other errors that may occur.
                console.error("Upload error:", error);
                setError(error as string);
                setUploading(false);
            }
        }
    };

    return (
        <div className="space-y-2">
            {/* File input element using React ref */}
            <input type="file" ref={fileInputRef} />
            {/* Button to trigger the upload process */}
            <button type="button" onClick={handleUpload}>
                Upload file
            </button>
            <br />
            {/* Display the current upload progress */}
            {
                uploading && <div className="flex items-center gap-2 text-sm text-center">
                    <Loader2 className="animate-spin w-4 h-4" />
                </div>
            }
            {/* Display any error messages */}
            {
                error && <div className="text-red-500 text-sm">{error}</div>
            }

            {/* Display the current upload progress */}
            
            Upload progress: <progress value={progress} max={100}></progress>
        </div>
    );
};

export default UploadExample;