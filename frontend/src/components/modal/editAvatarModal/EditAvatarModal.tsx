import { useState } from "react";
import { X, Loader2, Image as ImageIcon } from "lucide-react";
import Cropper from "react-easy-crop";
import type { Point, Area } from "react-easy-crop";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import styles from "./index.module.css";

export const EditAvatarModal = () => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    console.log(croppedArea, croppedAreaPixels);
  };

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
          <div className="crop-container">
            <Cropper
              image="https://img.huffingtonpost.com/asset/5ab4d4ac2000007d06eb2c56.jpeg?cache=sih0jwle4e&ops=1910_1000"
              crop={crop}
              zoom={zoom}
              aspect={4 / 3}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          <div className="controls">
            <Slider
              value={[zoom]}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(zoom) => setZoom(Number(zoom))}
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className={styles.footer}>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="bg-black hover:bg-gray-800 text-white"
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
