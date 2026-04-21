import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.post.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.project.deleteMany();
  await prisma.profile.deleteMany();

  await prisma.post.create({
    data: {
      title: "Empezando con Next.js 16",
      slug: "empezando-con-nextjs-16",
      content:
        "Guia practica para arrancar un proyecto moderno con App Router, componentes server y una base solida para escalar.",
      heroImage: "/images/blog/nextjs-16-cover.jpg",
      tags: "nextjs,react,frontend",
    },
  });

  await prisma.trip.create({
    data: {
      destination: "Santa Elena",
      date: new Date("2026-03-14T10:00:00.000Z"),
      description:
        "Ruta de fin de semana por Santa Elena, explorando miradores y cafes locales.",
      heroImage: "/images/travels/santa-elena-cover.jpg",
      locationName: "Santa Elena, Antioquia",
      images: [
        "/images/travels/santa-elena-1.jpg",
        "/images/travels/santa-elena-2.jpg",
        "/images/travels/santa-elena-3.jpg",
      ],
    },
  });

  await prisma.project.create({
    data: {
      title: "Portfolio Social Feed",
      description:
        "Proyecto personal para unificar blog, viajes y portafolio en un feed principal tipo red social.",
      heroImage: "/images/projects/portfolio-feed-cover.jpg",
      techStack: "Next.js, TypeScript, Prisma, Supabase",
      images: [
        "/images/projects/portfolio-feed-1.jpg",
        "/images/projects/portfolio-feed-2.jpg",
        "/images/projects/portfolio-feed-3.jpg",
      ],
    },
  });

  await prisma.profile.create({
    data: {
      name: "David Vasquez",
      bio: "Desarrollador full-stack enfocado en experiencias web limpias y rapidas.",
      photoUrl: "/images/profile/avatar.jpg",
      location: "Medellin, Colombia",
      role: "Software Engineer",
      email: "davidvasquez.s@hotmail.com",
      links: {
        github: "https://github.com/davidvidal",
        linkedin: "https://linkedin.com/in/davidvidal",
        website: "https://davidvidal.dev",
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
