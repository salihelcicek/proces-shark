"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createMission } from "@/lib/db/missions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AddMissionModal({ userId }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [totalDays, setTotalDays] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false); // ✅ Modal state
  const [error, setError] = useState("");
  
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !description.trim() || !totalDays) {
      setError("Lütfen tüm alanları doldurun.");
      return;
    }

    if (Number(totalDays) <= 0) {
      setError("Toplam gün sayısı 0 veya negatif olamaz.");
      return;
    }

    setLoading(true);

    try {
      await createMission(userId, name, description, Number(totalDays));
      setName("");
      setDescription("");
      setTotalDays("");
      router.refresh();
      toast.success("Mission başarıyla eklendi.");
 // ✅ Listeyi güncelle
      setOpen(false); // ✅ Modal'ı kapat
    } catch (error) {
        toast.error("Mission eklenirken hata oluştu.");
      console.error("Mission eklenirken hata oluştu:", error);
    } finally {
      setLoading(false);
    }

    
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}> {/* ✅ Modal state ile kontrol ediliyor */}
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>+ Yeni Mission Ekle</Button>
      </DialogTrigger>
      

            <DialogContent >
            <DialogTitle>Yeni Mission Ekle</DialogTitle> {/* ✅ Başlık eklendi, hata çözülüyor */}
            <form onSubmit={handleSubmit} className="space-y-4 ">
                <div>
                <Label className="py-2">Mission Adı</Label>
                <Input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                </div>
                <div>
                <Label className="py-2">Açıklama</Label>
                <Textarea 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                </div>
                <div>
                <Label className="py-2">Toplam Gün</Label>
                <Input 
                    type="number" 
                    value={totalDays} 
                    onChange={(e) => setTotalDays(e.target.value)}
                    min="1"
                    required
                />
                </div>
                <Button type="submit" disabled={loading}>
                {loading ? "Ekleniyor..." : "Kaydet"}
                </Button>
                <p>Mission oluşturulduktan sonra değiştirilemez !</p>
            </form>
            </DialogContent>

    </Dialog>
  );
}
