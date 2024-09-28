import { ChangeEvent, useEffect, useRef, useState } from "react";

import { Choose, Otherwise, When } from "@/presentation/components/conditionals";
import { UploadIcon } from "@/presentation/components/icons";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { useUserStore } from "@/presentation/store/user";

interface UploadPictureProps {
  originalPictureUrl: string | null;
}

const VALID_TYPES = ["image/jpeg", "image/png", "image/jpg"];
const MAX_SIZE_LIMIT = 2 * 1024 * 1024; // limit file size to 2MB

function isValidFile(file: File) {
  return VALID_TYPES.includes(file.type) && file.size <= MAX_SIZE_LIMIT;
}

export function UploadPicture({ originalPictureUrl }: UploadPictureProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);

  const { actions } = useUserStore();
  const inputFileRef = useRef<HTMLInputElement>(null);

  const isSaveDisabled = !uploadedFile;
  const isCancelDisabled = !uploadedFile;

  useEffect(() => {
    setFilePreviewUrl(originalPictureUrl);
  }, [originalPictureUrl]);

  useEffect(() => {
    if (uploadedFile) {
      const objectUrl = URL.createObjectURL(uploadedFile);
      setFilePreviewUrl(objectUrl);

      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }
  }, [uploadedFile]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      const file = event.target.files[0];

      if (!isValidFile(file)) {
        console.error("Invalid file type. Please upload a JPEG, PNG, or JPG file.");
        return;
      }

      setUploadedFile(file);
    }
  }

  function handleResetStates() {
    setFilePreviewUrl(originalPictureUrl);
    setUploadedFile(null);
  }

  function handleOpenFileSelectorTree() {
    if (inputFileRef.current) {
      inputFileRef.current.click();
    }
  }

  async function handleSubmit() {
    if (!uploadedFile) return;

    const formData = new FormData();
    formData.append("picture", uploadedFile);

    const response = await fetch("http://localhost:3333/api/account/upload/picture", {
      method: "PATCH",
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("@ftm")}`,
      },
      credentials: "include",
    });
    const { data } = await response.json();

    actions.addUser({
      email: data.email,
      id: data.id,
      name: data.name,
      pictureUrl: data.picture_url,
    });
    handleResetStates();
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
          <Choose>
            <When condition={!!filePreviewUrl}>
              <img src={filePreviewUrl!} className="object-contain max-w-full h-auto" />
            </When>

            <Otherwise>
              <span>No file selected</span>
            </Otherwise>
          </Choose>
        </span>

        <Input ref={inputFileRef} onChange={handleFileChange} className="hidden" type="file" accept=".jpeg,.jpg,.png" />
      </div>

      <div className="flex flex-col gap-4 mt-6">
        <Button onClick={handleSubmit} disabled={isSaveDisabled}>
          Save
        </Button>

        <Button onClick={handleResetStates} variant="secondary" disabled={isCancelDisabled}>
          Cancel
        </Button>
      </div>
    </>
  );
}
