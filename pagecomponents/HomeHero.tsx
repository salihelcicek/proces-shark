"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";



interface Integration {
  id: string;
  icon: React.ReactNode;
}

interface Hero32Props {
  heading?: string;
  description?: string;
  button?: {
    text: string;
    url: string;
  };
  integrations?: Integration[][];
}

const Hero32 = () => {
  const router = useRouter();
  return (
<section className="relative min-h-screen flex items-center justify-center bg-background dark:bg-gray-900 px-6 md:px-16">
      {/* Ana container */}
      <div className="container flex flex-col md:flex-row items-center justify-between gap-12">
        
        {/* Sol taraf: Başlık ve açıklama */}
        <div className="max-w-lg text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
            Adım Adım <br /> Hedeflerine Ulaş!
          </h1>
          <p className="mt-4 text-gray-700 dark:text-gray-300 text-lg">
            Hedeflerine ulaşmak için günlük adımlarını belirle, ilerlemeni kaydet ve süreçlerini yönet!
          </p>
          <Button 
            size="lg" 
            className="mt-6 bg-black text-white dark:bg-white dark:text-black dark:hover:bg-gray-700 dark:hover:text-white"
            onClick={() => router.push("/dashboard")} // ✅ Buraya yönlendirme eklendi!
          >
            Daha fazla bekleme, başla!
          </Button>
        </div>

        {/* Sağ taraf: Logo veya görsel */}
        <div className="flex justify-center md:justify-end">
          <Image 
            src="/favicon.png" 
            alt="ProcesShark Logo" 
            width={200} 
            height={200} 
            className="drop-shadow-lg dark:drop-shadow-xl dark:invert"
          />
        </div>
      </div>
    </section>
  );
};

export { Hero32 };
