import { ChangeEvent, useEffect, useRef, useState } from "react";

import { useUserStore } from "@/presentation/store/user";

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
