import "server-only";
import { prisma } from "./db";
import { cache } from "react";
export type { ModuleData, LessonData } from "./types";

// Shape com módulos e aulas para o frontend
export type CourseWithModules = Awaited<ReturnType<typeof getCourseWithModules>>;
export type CourseList = Awaited<ReturnType<typeof getAllCourses>>;

export const getAllCourses = cache(async () => {
  return prisma.course.findMany({
    where: { published: true },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: {
          lessons: { orderBy: { order: "asc" } },
        },
      },
    },
    orderBy: { order: "asc" },
  });
});

export const getAllCoursesAdmin = cache(async () => {
  return prisma.course.findMany({
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: { lessons: { orderBy: { order: "asc" } } },
      },
    },
    orderBy: { order: "asc" },
  });
});

export const getCourseWithModules = cache(async (id: string) => {
  return prisma.course.findUnique({
    where: { id },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: { lessons: { orderBy: { order: "asc" } } },
      },
    },
  });
});

export const getFeaturedCourse = cache(async () => {
  return prisma.course.findFirst({
    where: { isFeatured: true, published: true },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: { lessons: { orderBy: { order: "asc" } } },
      },
    },
  });
});

export const getNewCourses = cache(async () => {
  return prisma.course.findMany({
    where: { isNew: true, published: true },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: { lessons: { orderBy: { order: "asc" } } },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 8,
  });
});

export const getPopularCourses = cache(async () => {
  return prisma.course.findMany({
    where: { published: true },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: { lessons: { orderBy: { order: "asc" } } },
      },
    },
    orderBy: { students: "desc" },
    take: 8,
  });
});

export const getAllUsers = cache(async () => {
  return prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, avatar: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
});

// Helpers re-exported from types (convenience)
export { getTotalLessons, parseTags } from "./types";
