import { Button } from "@/presentation/components/ui/button";
import { Card, CardContent, CardHeader } from "@/presentation/components/ui/card";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";
import { useUserStore } from "@/presentation/store/user";

import { UploadPicture } from "./_components/upload-picture";

export default function SettingsProfileScreen() {
  const { state } = useUserStore();

  return (
    <section className="w-full max-w-xl mx-auto flex gap-8">
      <aside className="pt-3 self-start">
        <UploadPicture />
      </aside>

      <Card className="w-full self-start">
        <CardHeader className="text-2xl font-bold">Edit profile infos</CardHeader>

        <CardContent className="flex flex-col gap-4">
          <span className="space-y-2">
            <Label>Name</Label>
            <Input type="text" readOnly value={state.user.name} className="opacity-80" />
          </span>

          <span className="space-y-2">
            <Label>Email</Label>
            <Input type="email" readOnly value={state.user.email} className="opacity-80" />
          </span>

          <div className="flex gap-4 mt-4 justify-end">
            <Button disabled>Confirm</Button>

            <Button variant="secondary" disabled>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
