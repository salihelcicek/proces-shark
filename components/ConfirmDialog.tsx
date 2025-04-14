// components/ui/ConfirmDialog.tsx
"use client";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "Silmek istediğinize emin misiniz?",
  description = "Bu işlem geri alınamaz. Lütfen emin olun.",
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="w-5 h-5" />
            {title}
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <DialogFooter className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Vazgeç
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Evet, Sil
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
