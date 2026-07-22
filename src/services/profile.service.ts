import { db } from "@/lib/db";

export type ProfileLinks = {
  github?: string;
  linkedin?: string;
  website?: string;
};

export type Profile = {
  id: string;
  name: string;
  bio: string;
  photoUrl: string;
  location: string;
  role: string;
  email: string;
  links: ProfileLinks;
};

export async function getProfile(): Promise<Profile> {
  const profile = await db.profile.findFirst({
    orderBy: { createdAt: "asc" },
  });

  if (!profile) {
    throw new Error("Profile no encontrado");
  }

  return {
    id: profile.id,
    name: profile.name,
    bio: profile.bio,
    photoUrl: profile.photoUrl,
    location: profile.location,
    role: profile.role,
    email: profile.email,
    links: profile.links as ProfileLinks,
  };
}
