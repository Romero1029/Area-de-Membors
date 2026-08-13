// Shared types — safe to import in client components (no DB imports)

export interface LessonData {
  id: string;
  title: string;
  description: string;
  duration: string;
  order: number;
  locked: boolean;
  videoUrl: string;
  contentType: string;
  moduleId: string;
}

export interface ModuleData {
  id: string;
  title: string;
  order: number;
  courseId: string;
  lessons: LessonData[];
}

export interface CourseData {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorAvatar: string;
  instructorBio: string;
  thumbnail: string;
  category: string;
  level: string;
  duration: string;
  rating: number;
  students: number;
  isNew: boolean;
  isFeatured: boolean;
  published: boolean;
  tags: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  modules: ModuleData[];
}

// Alias for backwards compat with component imports
export type CourseWithModules = CourseData;

// Helpers — pure functions, no DB dependency
export function getTotalLessons(course: Pick<CourseData, "modules">): number {
  return course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
}

export function parseTags(tags: string): string[] {
  try { return JSON.parse(tags); } catch { return []; }
}

export function formatDuration(seconds: number | null | undefined): string {
  if (!seconds) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /youtube\.com\/watch\?(?:.*&)?v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

/**
 * Converts Google Drive share links to a displayable image URL.
 * Accepts: /file/d/ID/view, /open?id=ID, /uc?id=ID
 * Returns: drive.google.com/thumbnail?id=ID&sz=w1280
 */
export function parseDriveUrl(url: string): string {
  if (!url) return url;

  const patterns = [
    /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/,
    /drive\.google\.com\/open\?(?:.*&)?id=([a-zA-Z0-9_-]+)/,
    /drive\.google\.com\/uc\?(?:.*&)?id=([a-zA-Z0-9_-]+)/,
    /drive\.google\.com\/thumbnail\?(?:.*&)?id=([a-zA-Z0-9_-]+)/,
    /drive\.usercontent\.google\.com\/download\?(?:.*&)?id=([a-zA-Z0-9_-]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      // drive.usercontent.google.com é o destino final sem redirect — mais confiável em <img>
      return `https://drive.usercontent.google.com/download?id=${match[1]}&export=view&authuser=0`;
    }
  }

  return url;
}
