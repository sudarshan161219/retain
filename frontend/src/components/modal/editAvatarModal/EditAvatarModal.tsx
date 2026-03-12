import { useState } from "react";
import Cropper from "react-easy-crop";
import { ZoomIn, ZoomOut } from "lucide-react";
import type { Point, Area } from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";
import { Slider } from "@/components/ui/slider";
import styles from "./index.module.css";
import { useAvatarStore } from "@/store/avatarStore/useAvatarStore";

export const EditAvatarModal = () => {
  const { file, previewUrl, handleFileSelect, clearFile } = useAvatarStore();

  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    console.log(croppedArea, croppedAreaPixels);
  };

  const handleZoom = (i: number[]) => {
    setZoom(i[0]);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(10, prev + 0.5)); // Jumps by 0.5 on click
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(1, prev - 0.5));
  };

  return (
    <div className={styles.app}>
      <div className={styles.cropcontainer}>
        <Cropper
          disableAutomaticStylesInjection={true}
          style={{
            cropAreaStyle: {
              border: "2px solid red",
            },
            mediaStyle: {
              maxWidth: "unset",
              width: "unset",
            },
          }}
          image={previewUrl || ""}
          crop={crop}
          zoom={zoom}
          aspect={5 / 5}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      </div>
      <div className={styles.controls}>
        <button onClick={handleZoomOut} className={styles.zoomBtns}>
          <ZoomOut size={19} />
        </button>
        <Slider
          className="cursor-pointer "
          defaultValue={[zoom]}
          value={[zoom]}
          min={1}
          max={10}
          step={0.1}
          aria-labelledby="Zoom"
          onValueChange={handleZoom}
        />
        <button onClick={handleZoomIn} className={styles.zoomBtns}>
          <ZoomIn size={19} />
        </button>
      </div>
    </div>
  );
};
