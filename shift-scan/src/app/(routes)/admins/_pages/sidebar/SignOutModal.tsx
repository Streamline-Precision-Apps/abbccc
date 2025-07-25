"use client";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function SignOutModal({ open, setOpen }: Props) {
  const t = useTranslations("Admins");
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("SignOutQuestion")}</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="destructive"
            type="button"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            className="bg-emerald-400"
            type="button"
            onClick={async () => {
              setOpen(false);
              await signOut({
                redirect: true,
                callbackUrl: "/signin",
              });
            }}
          >
            Yes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
