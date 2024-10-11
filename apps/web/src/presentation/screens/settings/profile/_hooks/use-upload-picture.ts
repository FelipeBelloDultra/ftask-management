import { DefaultError, useMutation } from "@tanstack/react-query";
import { ChangeEvent, useEffect, useRef, useState } from "react";

import { User } from "@/domain/user";
import { useToast } from "@/presentation/components/ui/use-toast";
import { useUserStore } from "@/presentation/store/user";
import { uploadProfilePicture } from "@/services/upload-profile-picture";

const VALID_TYPES = ["image/jpeg", "image/png", "image/jpg"];
const MAX_SIZE_LIMIT = 2 * 1024 * 1024; // limit file size to 2MB

function isValidFile(file: File) {
  return VALID_TYPES.includes(file.type) && file.size <= MAX_SIZE_LIMIT;
}

export function useUploadPicture() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const { mutate, isPending } = useMutation<User, DefaultError, File>({
    mutationFn: (uploadedFile: File) =>
      uploadProfilePicture({
        pictureFile: uploadedFile,
      }),
    onSuccess: (user) => {
      actions.addUser(user);
      handleResetStates();
    },
    onError: () => {
      toast({
        title: "Failed to upload profile picture",
        description: "Something went wrong uploading profile picture, please try again",
        variant: "destructive",
        duration: 3000,
      });
      handleResetStates();
    },
  });

  const { actions, state } = useUserStore();
  const inputFileRef = useRef<HTMLInputElement>(null);

  const filePreviewUrl = uploadedFile ? URL.createObjectURL(uploadedFile) : state.user.pictureUrl;
  const isSaveDisabled = !uploadedFile || isPending;
  const isCancelDisabled = !uploadedFile || isPending;

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

    mutate(uploadedFile);
  }

  return {
    filePreviewUrl,
    isSaveDisabled,
    isCancelDisabled,
    inputFileRef,
    isLoading: isPending,
    handleFileChange,
    handleOpenFileSelectorTree,
    handleSubmit,
    handleResetStates,
  };
}
