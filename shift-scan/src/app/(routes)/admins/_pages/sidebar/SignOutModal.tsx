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
      <DialogContent className="w-[90%] h-[200px] rounded-lg">
        <DialogHeader className="mt-5">
          <DialogTitle className="text-center">
            {t("SignOutQuestion")}
          </DialogTitle>
        </DialogHeader>
        <DialogFooter className="flex flex-row  gap-3">
          <Button
            className="w-1/2 bg-app-gray text-gray-600 hover:bg-gray-200"
            size={"lg"}
            type="button"
            onClick={() => setOpen(false)}
          >
            {t("Cancel")}
          </Button>
          <Button
            className="w-1/2"
            type="button"
            variant="destructive"
            size={"lg"}
            onClick={async () => {
              setOpen(false);
              await signOut({
                redirect: true,
                callbackUrl: "/signin",
              });
            }}
          >
            {t("Logout")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
