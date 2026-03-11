import { useState, useRef } from "react";
import {
  X,
  UploadCloud,
  Loader2,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";
import { useAvatarStore } from "@/store/avatarStore/useAvatarStore";
import { useModalStore } from "@/store/modalStore/useModalStore";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { EditAvatarModal } from "@/components/modal/editAvatarModal/EditAvatarModal";
import styles from "./index.module.css";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const AvatarUploadModal = () => {
  const { isOpen, type, closeModal } = useModalStore();
  const { file, previewUrl, handleFileSelect, clearFile } = useAvatarStore();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- CLEANUP ---
  const handleClose = () => {
    closeModal();
    setTimeout(() => {
      clearFile();
      if (fileInputRef.current) fileInputRef.current.value = "";
    }, 200);
  };

  // --- FILE HANDLING ---
  const processFile = (selectedFile: File) => {
    if (!selectedFile.type.startsWith("image/")) {
      toast.error("Please select an image file (JPG, PNG, WebP).");
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      toast.error("File is too large. Maximum size is 5MB.");
      return;
    }

    handleFileSelect(selectedFile);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // --- DRAG & DROP ---
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // --- API UPLOAD ---
  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);

    try {
      // Create FormData to send the file to your Express backend
      const formData = new FormData();
      formData.append("avatar", file);

      // Example API call:
      // await api.post("/users/avatar", formData, {
      //   headers: { "Content-Type": "multipart/form-data" },
      // });

      // Simulating network request for now
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Avatar updated successfully!");
      handleClose();
      // queryClient.invalidateQueries({ queryKey: ["user"] }); // Refresh user data
    } catch (error) {
      toast.error("Failed to upload avatar. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen || type !== "AVATAR_UPLOAD") return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Upload Avatar</h2>
            <p className={styles.subtitle}>
              Choose a profile picture for your workspace.
            </p>
          </div>
          <button
            onClick={handleClose}
            className={styles.closeBtn}
            disabled={isUploading}
          >
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <div className={styles.body}>
          {!previewUrl ? (
            /* DROPZONE STATE */
            <div
              className={`${styles.dropzone} ${isDragging ? styles.dropzoneActive : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className={styles.dropzoneContent}>
                <div className={styles.iconWrapper}>
                  <UploadCloud size={32} />
                </div>
                <p className={styles.dropzoneText}>
                  <span className={styles.dropzoneHighlight}>
                    Click to upload
                  </span>{" "}
                  or drag and drop
                </p>
                <p className={styles.dropzoneSubtext}>
                  SVG, PNG, JPG or WebP (max. 5MB)
                </p>
              </div>
            </div>
          ) : (
            /* PREVIEW STATE */
            <EditAvatarModal />
          )}

          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/webp, image/svg+xml"
            className="hidden"
          />
        </div>

        {/* FOOTER */}
        <div className={styles.footer}>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isUploading}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="cursor-pointer"
          >
            {isUploading ? (
              <Loader2 className="animate-spin mr-2" size={16} />
            ) : (
              <ImageIcon className="mr-2" size={16} />
            )}
            {isUploading ? "Uploading..." : "Save Avatar"}
          </Button>
        </div>
      </div>
    </div>
  );
};
