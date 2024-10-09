import { ChangeEvent, useEffect, useRef, useState } from "react";

import { useUserStore } from "@/presentation/store/user";
import { uploadProfilePicture } from "@/services/upload-profile-picture";

const VALID_TYPES = ["image/jpeg", "image/png", "image/jpg"];
const MAX_SIZE_LIMIT = 2 * 1024 * 1024; // limit file size to 2MB

function isValidFile(file: File) {
  return VALID_TYPES.includes(file.type) && file.size <= MAX_SIZE_LIMIT;
}

export function useUploadPicture() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const { actions, state } = useUserStore();
  const inputFileRef = useRef<HTMLInputElement>(null);

  const filePreviewUrl = uploadedFile ? URL.createObjectURL(uploadedFile) : state.user.pictureUrl;
  const isSaveDisabled = !uploadedFile;
  const isCancelDisabled = !uploadedFile;

  useEffect(() => {
    if (uploadedFile && filePreviewUrl) {
      return () => {
        URL.revokeObjectURL(filePreviewUrl);
      };
    }
  }, [uploadedFile]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;

    if (files && isValidFile(files[0])) {
      const file = files[0];
      setUploadedFile(file);
    }
  }

  function handleResetStates() {
    setUploadedFile(null);
  }

  function handleOpenFileSelectorTree() {
    if (inputFileRef.current) {
      inputFileRef.current.click();
    }
  }

  async function handleSubmit() {
    if (!uploadedFile) return;

    const user = await uploadProfilePicture({
      pictureFile: uploadedFile,
    });

    actions.addUser({
      email: user.email,
      id: user.id,
      name: user.name,
      pictureUrl: user.pictureUrl,
    });
    handleResetStates();
  }

  return {
    filePreviewUrl,
    isSaveDisabled,
    isCancelDisabled,
    inputFileRef,
    handleFileChange,
    handleOpenFileSelectorTree,
    handleSubmit,
    handleResetStates,
  };
}
