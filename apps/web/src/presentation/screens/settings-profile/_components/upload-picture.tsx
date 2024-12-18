import { Choose, Otherwise, When } from "@/presentation/components/conditionals";
import { InfoIcon, Loader2Icon, UploadIcon } from "@/presentation/components/icons";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/presentation/components/ui/tooltip";
import { useDependencies } from "@/presentation/hooks/use-dependencies";

import { useUploadPicture } from "../_hooks/use-upload-picture";

export function UploadPicture() {
  const { profileAdapter } = useDependencies();
  const {
    handleFileChange,
    handleOpenFileSelectorTree,
    handleSubmit,
    handleResetStates,
    isLoading,
    filePreviewUrl,
    inputFileRef,
    isCancelDisabled,
    isSaveDisabled,
  } = useUploadPicture({ profileAdapter });

  return (
    <>
      <div className="relative inline-block">
        <Button
          className="peer absolute left-0 bottom-0 z-10"
          variant="outline"
          size="icon"
          onClick={handleOpenFileSelectorTree}
          disabled={isLoading}
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

        <TooltipProvider>
          <Tooltip>
            <Button variant="outline" size="icon" className="rounded-full absolute right-0 bottom-0 z-10" asChild>
              <TooltipTrigger>
                <InfoIcon size={20} />
              </TooltipTrigger>
            </Button>
            <TooltipContent>
              <p>
                We recommend you to use icon sizes that <br />
                are the same for width and height.
              </p>

              <span className="inline-block mt-2">
                Example: <code>512x512px</code>
              </span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Input ref={inputFileRef} onChange={handleFileChange} className="hidden" type="file" accept=".jpeg,.jpg,.png" />
      </div>

      <div className="flex flex-col gap-4 mt-6">
        <Button onClick={handleSubmit} disabled={isSaveDisabled}>
          {isLoading ? <Loader2Icon className="mr-2 h-4 w-4 animate-spin" /> : <>Save</>}
        </Button>

        <Button onClick={handleResetStates} variant="secondary" disabled={isCancelDisabled}>
          {isLoading ? <Loader2Icon className="mr-2 h-4 w-4 animate-spin" /> : <>Cancel</>}
        </Button>
      </div>
    </>
  );
}
