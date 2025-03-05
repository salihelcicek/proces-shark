import MissionDetail from "./components/MissionDetail";
import { getUserSession } from "@/lib/auth"; // ✅ Artık bu dosya var!

export default async function MissionDetailPage({ params }) {
  const user = await getUserSession(); // ✅ Kullanıcı bilgisini çekiyoruz
  const { missionId } = params;

  return <MissionDetail missionId={missionId} user={user} />;
}
