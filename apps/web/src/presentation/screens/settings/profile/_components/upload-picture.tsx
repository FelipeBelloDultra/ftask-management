import { useRef, useState } from "react";

import { UploadIcon } from "@/presentation/components/icons";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";

interface UploadPictureProps {
  originalPictureUrl: string | null;
}

export function UploadPicture({ originalPictureUrl }: UploadPictureProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(originalPictureUrl);
  const inputFileRef = useRef<HTMLInputElement>(null);

  const canDisabledCancelButton = filePreviewUrl === null;
  const canSaveUploadedFile = uploadedFile !== null;

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      const file = event.target.files[0];

      if (!isValidFile(file)) {
        console.error("Invalid file type. Please upload a JPEG, PNG, or JPG file.");
        return;
      }

      setFilePreviewUrl(URL.createObjectURL(file));
      setUploadedFile(file);
    }
  }

  function isValidFile(file: File) {
    const VALID_TYPES = ["image/jpeg", "image/png", "image/jpg"];
    const MAX_SIZE_LIMIT = 2 * 1024 * 1024; // limit file size to 2MB
    return VALID_TYPES.includes(file.type) && file.size <= MAX_SIZE_LIMIT;
  }

  function handleResetStates() {
    setUploadedFile(null);
    setFilePreviewUrl(originalPictureUrl);
  }

  function handleOpenFileSelectorTree() {
    if (inputFileRef.current) {
      inputFileRef.current.click();
    }
  }

  return (
    <>
      <div className="relative inline-block">
        <Button
          className="peer absolute left-0 bottom-0 z-10"
          variant="outline"
          size="icon"
          onClick={handleOpenFileSelectorTree}
        >
          <UploadIcon size={20} />
        </Button>

        <span className="border-dashed border flex items-center justify-center rounded-full size-36 overflow-hidden p-2 transition peer-hover:border-muted-foreground peer-focus-visible:border-muted-foreground">
          {filePreviewUrl ? (
            <img src={filePreviewUrl} className="object-contain max-w-full h-auto" />
          ) : (
            <span>No file selected</span>
          )}
        </span>

        <Input ref={inputFileRef} onChange={handleFileChange} className="hidden" type="file" accept=".jpeg,.jpg,.png" />
      </div>

      <div className="flex flex-col gap-4 mt-6">
        <Button disabled={!canSaveUploadedFile}>Save</Button>

        <Button onClick={handleResetStates} variant="secondary" disabled={canDisabledCancelButton}>
          Cancel
        </Button>
      </div>
    </>
  );
}
