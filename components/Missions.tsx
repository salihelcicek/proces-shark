"use client";

import { useRouter } from "next/navigation";
import { useMissionsRealtime } from "@/lib/realtime3";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import type { Mission } from "@/types/types";
import { useState } from "react";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function Missions({ userId }: { userId: string }) {
  const router = useRouter();
  const supabase = createClient();

  // ✅ Use Realtime Hook to automatically update missions
  


  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // ✅ Sil butonuna tıklandığında açılacak olan modal için state
  const handleDeleteClick = (missionId: string) => {
    setSelectedId(missionId);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedId) return;

    const { error } = await supabase.from("missions").delete().eq("id", selectedId);
    if (error) {
      toast.error("Görev silinirken bir hata oluştu.");
    } else {
      toast.success("Görev başarıyla silindi!");
    }

    setConfirmOpen(false);
    setSelectedId(null);
  };



  const missions = useMissionsRealtime(userId) as Mission[];
  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4">Mission List</h2>
      {missions.length > 0 ? (
        <Carousel>
          <CarouselContent className="flex space-x-4">
            {missions.map((mission) => (
              <CarouselItem key={mission.id} className="basis-1/3">
                <Card
                  className="relative cursor-pointer hover:shadow-lg hover:bg-slate-100 transition-all duration-300 ease-in-out dark:hover:bg-gray-700"
                  onClick={() => router.push(`/dashboard/mission/${mission.id}`)}
                >
                  {/* 🗑️ Sil Butonu */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(mission.id);
                    }}
                    className="absolute top-2 right-2 p-1 rounded hover:bg-red-100 dark:hover:bg-red-900 text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <CardHeader>
                    <CardTitle className="text-blue-400 font-extrabold">{mission.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{mission.description}</p>
                    <p className="text-sm text-gray-500">Toplam Gün: {mission.total_days}</p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      ) : (
        <p className="text-center text-gray-500">Henüz bir mission eklemediniz.</p>
      )}

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Bu görevi silmek istiyor musun?"
        description="Bu işlem geri alınamaz. Silinen görev kalıcı olarak kaybolur."
      />

    </div>
  );
}
