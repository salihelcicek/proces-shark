"use client";

import { useRouter } from "next/navigation";
import { useRealtimeUpdates } from "@/lib/realtime";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Missions({ userId }) {
  const router = useRouter();
  
  // ✅ Use Realtime Hook to automatically update missions
  const missions = useRealtimeUpdates("missions", userId);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4">Mission List</h2>
      {missions.length > 0 ? (
        <Carousel>
          <CarouselContent className="flex space-x-4">
            {missions.map((mission) => (
              <CarouselItem key={mission.id} className="basis-1/3">
                <Card
                  className="cursor-pointer hover:shadow-lg hover:bg-slate-100 transition-all duration-300 ease-in-out dark:hover:bg-gray-700"
                  onClick={() => router.push(`/dashboard/mission/${mission.id}`)}
                >
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
    </div>
  );
}
