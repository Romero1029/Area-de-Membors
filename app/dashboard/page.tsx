import { getAllCourses, getFeaturedCourse, getNewCourses, getPopularCourses } from "@/lib/queries";
import { getSession } from "@/lib/auth";
import { DashboardClient } from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [featured, allCourses, newCourses, popular, session] = await Promise.all([
    getFeaturedCourse(),
    getAllCourses(),
    getNewCourses(),
    getPopularCourses(),
    getSession(),
  ]);

  const isAdmin = (session?.user as any)?.role === "admin";

  // In-progress: cursos com progress > 0 < 100 (mock por enquanto, expandir com enrollment futuramente)
  const inProgress = allCourses.filter((c) => c.students > 5000 && !c.isFeatured).slice(0, 4);

  return (
    <DashboardClient
      featured={featured}
      inProgress={inProgress}
      newCourses={newCourses}
      popular={popular}
      allCourses={allCourses}
      isAdmin={isAdmin}
    />
  );
}
