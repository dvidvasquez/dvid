import Image from "next/image";
import type { Profile } from "@/services/profile.service";
import styles from "./ProfileCard.module.scss";

type ProfileCardProps = {
  profile: Profile;
};

const LINK_LABELS: Record<keyof Profile["links"], string> = {
  github: "GitHub",
  linkedin: "LinkedIn",
  website: "Sitio web",
};

export function ProfileCard({ profile }: ProfileCardProps) {
  const links = Object.entries(profile.links).filter(([, href]) => Boolean(href)) as Array<
    [keyof Profile["links"], string]
  >;

  return (
    <article className={styles.card}>
      <Image
        className={styles.photo}
        src={profile.photoUrl}
        alt={profile.name}
        width={96}
        height={96}
      />
      <h1 className={styles.name}>{profile.name}</h1>
      <p className={styles.role}>{profile.role}</p>
      <p className={styles.location}>{profile.location}</p>
      <p className={styles.bio}>{profile.bio}</p>
      <a className={styles.email} href={`mailto:${profile.email}`}>
        {profile.email}
      </a>
      {links.length > 0 && (
        <ul className={styles.links}>
          {links.map(([key, href]) => (
            <li key={key}>
              <a href={href} target="_blank" rel="noopener noreferrer">
                {LINK_LABELS[key]}
              </a>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
