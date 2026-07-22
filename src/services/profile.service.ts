import { db } from "@/lib/db";

export async function getUserProfile(userId: string) {
  const user = await db.profile.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      bio: true,
      image: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new Error(`User with id ${userId} not found`);
  }

  return user;
}