import { ProfileCard } from "@/components/commons/ProfileCard";
import { SectionHeader } from "@/components/commons/SectionHeader";
import { getProfile } from "@/services/profile.service";
import styles from "../page.module.scss";

export default async function ProfilePage() {
  const profile = await getProfile();

  return (
    <main className={styles.main}>
      <div className={styles.feedShell}>
        <SectionHeader title="Perfil" subtitle="Sobre mi" />
        <ProfileCard profile={profile} />
      </div>
    </main>
  );
}
