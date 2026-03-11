import { useState } from "react";
import { X, Loader2, Image as ImageIcon } from "lucide-react";
import Cropper from "react-easy-crop";
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

  const handleZoom = (i: number) => {
    setZoom(Number(i));
    console.log(i);
  };

  return (
    <div className={styles.app}>
      {/* HEADER */}
      {/* <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Upload Avatar</h2>
            <p className={styles.subtitle}>
              Choose a profile picture for your workspace.
            </p>
          </div>
          <button className={styles.closeBtn}>
            <X size={20} />
          </button>
        </div> */}

      {/* BODY */}
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
          aspect={4 / 3}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      </div>
      <div className={styles.controls}>
        <Slider
          defaultValue={[zoom]}
          min={1}
          max={3}
          step={0.1}
          aria-labelledby="Zoom"
          onValueCommit={(zoom) => handleZoom(Number(zoom))}
        />
      </div>

      {/* FOOTER */}
      {/* <div className={styles.footer}>
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button
            type="button"
            className="bg-black hover:bg-gray-800 text-white"
          >
            Save
          </Button>
        </div> */}
    </div>
  );
};
