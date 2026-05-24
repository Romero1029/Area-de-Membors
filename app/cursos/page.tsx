import { getAllCoursesAdmin, getAllCourses } from "@/lib/queries";
import { getSession } from "@/lib/auth";
import { CursosClient } from "./CursosClient";

export const dynamic = "force-dynamic";

export default async function CursosPage() {
  const session = await getSession();
  const isAdmin = (session?.user as any)?.role === "ADMIN";

  const courses = isAdmin ? await getAllCoursesAdmin() : await getAllCourses();

  return <CursosClient courses={courses} isAdmin={isAdmin} />;
}
