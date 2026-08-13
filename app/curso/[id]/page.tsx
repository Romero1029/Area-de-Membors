import { notFound } from "next/navigation";
import { getCourseWithModules, getTotalLessons, parseTags } from "@/lib/queries";
import { getSession } from "@/lib/auth";
import { CoursePageClient } from "./CoursePageClient";

export const dynamic = "force-dynamic";

interface PageProps {
  params: { id: string };
}

export default async function CoursePage({ params }: PageProps) {
  const [course, session] = await Promise.all([
    getCourseWithModules(params.id),
    getSession(),
  ]);

  if (!course) notFound();

  const isAdmin = (session?.user as any)?.role === "admin";

  return (
    <CoursePageClient
      course={course}
      isAdmin={isAdmin}
      totalLessons={getTotalLessons(course)}
      tags={parseTags(course.tags)}
    />
  );
}
