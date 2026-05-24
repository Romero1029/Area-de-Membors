export type Lesson = {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  locked: boolean;
  videoUrl?: string;
  description?: string;
};

export type Module = {
  id: string;
  title: string;
  lessons: Lesson[];
};

export type Course = {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorAvatar: string;
  instructorBio: string;
  thumbnail: string;
  category: string;
  level: "Iniciante" | "Intermediário" | "Avançado";
  duration: string;
  totalLessons: number;
  rating: number;
  students: number;
  progress: number;
  isNew?: boolean;
  isFeatured?: boolean;
  tags: string[];
  modules: Module[];
};

export type Badge = {
  id: string;
  title: string;
  icon: string;
  description: string;
  earned: boolean;
  earnedAt?: string;
};

export type Certificate = {
  id: string;
  courseId: string;
  courseTitle: string;
  issuedAt: string;
  credentialId: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinedAt: string;
  streak: number;
  totalHours: number;
  completedCourses: number;
  badges: Badge[];
  certificates: Certificate[];
};

export const mockUser: User = {
  id: "user-1",
  name: "João Silva",
  email: "joao.silva@email.com",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=joaosilva",
  joinedAt: "2024-01-15",
  streak: 12,
  totalHours: 87,
  completedCourses: 3,
  badges: [
    {
      id: "b1",
      title: "Primeiro Passo",
      icon: "🚀",
      description: "Completou a primeira aula",
      earned: true,
      earnedAt: "2024-01-16",
    },
    {
      id: "b2",
      title: "Semana Dedicada",
      icon: "🔥",
      description: "7 dias consecutivos estudando",
      earned: true,
      earnedAt: "2024-02-01",
    },
    {
      id: "b3",
      title: "Maratonista",
      icon: "⚡",
      description: "5 horas de estudo em um dia",
      earned: true,
      earnedAt: "2024-02-10",
    },
    {
      id: "b4",
      title: "Mestre do Código",
      icon: "💎",
      description: "Complete 5 cursos",
      earned: false,
    },
    {
      id: "b5",
      title: "Top Aluno",
      icon: "🏆",
      description: "Entre os top 10% da plataforma",
      earned: false,
    },
    {
      id: "b6",
      title: "Mentor",
      icon: "🎯",
      description: "Ajude 10 colegas no fórum",
      earned: false,
    },
  ],
  certificates: [
    {
      id: "cert-1",
      courseId: "1",
      courseTitle: "Next.js 14: Do Zero ao Deploy",
      issuedAt: "2024-03-10",
      credentialId: "IDM-2024-NXT-001",
    },
    {
      id: "cert-2",
      courseId: "2",
      courseTitle: "React Avançado com TypeScript",
      issuedAt: "2024-02-20",
      credentialId: "IDM-2024-RCT-002",
    },
  ],
};

export const mockCourses: Course[] = [
  {
    id: "1",
    title: "Next.js 14: Do Zero ao Deploy",
    description:
      "Domine o framework mais poderoso do ecossistema React. Aprenda App Router, Server Components, SSR, SSG, e faça deploy profissional na Vercel. Um curso completo para quem quer construir aplicações web modernas e escaláveis.",
    instructor: "Rafael Costa",
    instructorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rafaelcosta",
    instructorBio:
      "Full-stack developer com 10 anos de experiência. Contribuidor ativo do ecossistema React e criador de diversos projetos open-source.",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1280&h=720&fit=crop",
    category: "Desenvolvimento Web",
    level: "Intermediário",
    duration: "24h 30min",
    totalLessons: 48,
    rating: 4.9,
    students: 12847,
    progress: 68,
    isFeatured: true,
    tags: ["Next.js", "React", "TypeScript", "Vercel", "SSR"],
    modules: [
      {
        id: "m1",
        title: "Fundamentos do Next.js 14",
        lessons: [
          { id: "l1", title: "Introdução e setup do ambiente", duration: "12:30", completed: true, locked: false },
          { id: "l2", title: "App Router vs Pages Router", duration: "18:45", completed: true, locked: false },
          { id: "l3", title: "Estrutura de pastas e convenções", duration: "14:20", completed: true, locked: false },
          { id: "l4", title: "Server Components vs Client Components", duration: "22:10", completed: true, locked: false },
          { id: "l5", title: "Layouts e Templates", duration: "16:55", completed: false, locked: false },
        ],
      },
      {
        id: "m2",
        title: "Data Fetching e Cache",
        lessons: [
          { id: "l6", title: "fetch() no servidor e cache strategies", duration: "20:00", completed: false, locked: false },
          { id: "l7", title: "ISR: Incremental Static Regeneration", duration: "17:30", completed: false, locked: false },
          { id: "l8", title: "Parallel e Sequential Data Fetching", duration: "15:45", completed: false, locked: true },
          { id: "l9", title: "Streaming com Suspense", duration: "19:20", completed: false, locked: true },
        ],
      },
      {
        id: "m3",
        title: "Roteamento Avançado",
        lessons: [
          { id: "l10", title: "Rotas dinâmicas e catch-all", duration: "14:00", completed: false, locked: true },
          { id: "l11", title: "Route Groups e Private Folders", duration: "11:30", completed: false, locked: true },
          { id: "l12", title: "Parallel Routes e Intercepting Routes", duration: "23:15", completed: false, locked: true },
          { id: "l13", title: "Middleware e Edge Runtime", duration: "18:40", completed: false, locked: true },
        ],
      },
      {
        id: "m4",
        title: "Deploy e Otimização",
        lessons: [
          { id: "l14", title: "Otimização de imagens com next/image", duration: "12:00", completed: false, locked: true },
          { id: "l15", title: "Fontes e performance", duration: "10:30", completed: false, locked: true },
          { id: "l16", title: "Deploy na Vercel", duration: "16:45", completed: false, locked: true },
          { id: "l17", title: "Monitoramento e Analytics", duration: "13:20", completed: false, locked: true },
        ],
      },
    ],
  },
  {
    id: "2",
    title: "React Avançado com TypeScript",
    description:
      "Leve suas habilidades React ao próximo nível com TypeScript. Patterns avançados, performance optimization, custom hooks e arquitetura escalável para aplicações enterprise.",
    instructor: "Ana Beatriz Lima",
    instructorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=anabeatriz",
    instructorBio:
      "Engenheira de software senior no Nubank. Especialista em React e TypeScript, palestrante em conferências tech pelo Brasil.",
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1280&h=720&fit=crop",
    category: "Frontend",
    level: "Avançado",
    duration: "31h 15min",
    totalLessons: 62,
    rating: 4.8,
    students: 8934,
    progress: 100,
    tags: ["React", "TypeScript", "Hooks", "Performance", "Patterns"],
    modules: [
      {
        id: "m1",
        title: "TypeScript com React",
        lessons: [
          { id: "l1", title: "Tipos e interfaces para componentes", duration: "20:00", completed: true, locked: false },
          { id: "l2", title: "Generics em componentes React", duration: "25:30", completed: true, locked: false },
          { id: "l3", title: "Discriminated Unions e type guards", duration: "18:45", completed: true, locked: false },
          { id: "l4", title: "Utility Types no React", duration: "22:10", completed: true, locked: false },
          { id: "l5", title: "Template Literal Types", duration: "16:20", completed: true, locked: false },
        ],
      },
      {
        id: "m2",
        title: "Patterns Avançados",
        lessons: [
          { id: "l6", title: "Compound Components", duration: "28:00", completed: true, locked: false },
          { id: "l7", title: "Render Props e HOCs tipados", duration: "24:30", completed: true, locked: false },
          { id: "l8", title: "Context API otimizada", duration: "19:45", completed: true, locked: false },
          { id: "l9", title: "Custom Hooks avançados", duration: "26:20", completed: true, locked: false },
        ],
      },
    ],
  },
  {
    id: "3",
    title: "Design System do Zero",
    description:
      "Construa um design system profissional do zero com Tailwind CSS, Storybook e tokens de design. Crie componentes acessíveis, documentados e escaláveis para toda a sua equipe.",
    instructor: "Carlos Mendez",
    instructorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=carlosmendez",
    instructorBio:
      "Designer de produto e desenvolvedor frontend. Criador do open-source UI Kit mais usado no Brasil, com mais de 50k estrelas no GitHub.",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1280&h=720&fit=crop",
    category: "Design & Dev",
    level: "Intermediário",
    duration: "18h 45min",
    totalLessons: 38,
    rating: 4.7,
    students: 5621,
    progress: 35,
    isNew: true,
    tags: ["Design System", "Tailwind", "Storybook", "Acessibilidade", "Tokens"],
    modules: [
      {
        id: "m1",
        title: "Fundamentos de Design Systems",
        lessons: [
          { id: "l1", title: "O que é um Design System?", duration: "15:00", completed: true, locked: false },
          { id: "l2", title: "Atomic Design e Component Driven", duration: "20:30", completed: true, locked: false },
          { id: "l3", title: "Design Tokens: cores, tipografia e espaços", duration: "25:45", completed: true, locked: false },
          { id: "l4", title: "Configurando Tailwind para o DS", duration: "18:10", completed: false, locked: false },
          { id: "l5", title: "Estrutura de pastas do projeto", duration: "12:20", completed: false, locked: false },
        ],
      },
      {
        id: "m2",
        title: "Componentes Base",
        lessons: [
          { id: "l6", title: "Button e variantes", duration: "22:00", completed: false, locked: false },
          { id: "l7", title: "Input, Select e Form", duration: "28:30", completed: false, locked: true },
          { id: "l8", title: "Modal e Drawer", duration: "24:45", completed: false, locked: true },
          { id: "l9", title: "Toast e Notifications", duration: "19:20", completed: false, locked: true },
        ],
      },
    ],
  },
  {
    id: "4",
    title: "Node.js & APIs REST Profissional",
    description:
      "Construa APIs robustas, escaláveis e seguras com Node.js, Express, Prisma e PostgreSQL. Autenticação JWT, upload de arquivos, testes automatizados e deploy em produção.",
    instructor: "Mariana Santos",
    instructorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=marianasantos",
    instructorBio:
      "Backend engineer com passagem por Stripe e Mercado Livre. Especialista em arquitetura de microsserviços e sistemas de alta disponibilidade.",
    thumbnail: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1280&h=720&fit=crop",
    category: "Backend",
    level: "Intermediário",
    duration: "28h 00min",
    totalLessons: 55,
    rating: 4.8,
    students: 9102,
    progress: 0,
    isNew: true,
    tags: ["Node.js", "Express", "Prisma", "PostgreSQL", "JWT"],
    modules: [
      {
        id: "m1",
        title: "Setup e Fundamentos",
        lessons: [
          { id: "l1", title: "Node.js moderno com ESM", duration: "14:00", completed: false, locked: false },
          { id: "l2", title: "Express.js setup profissional", duration: "18:30", completed: false, locked: false },
          { id: "l3", title: "Estrutura MVC e Clean Architecture", duration: "25:45", completed: false, locked: true },
          { id: "l4", title: "Variáveis de ambiente e config", duration: "12:10", completed: false, locked: true },
          { id: "l5", title: "Error handling centralizado", duration: "16:20", completed: false, locked: true },
        ],
      },
      {
        id: "m2",
        title: "Banco de Dados com Prisma",
        lessons: [
          { id: "l6", title: "Prisma setup e schema", duration: "20:00", completed: false, locked: true },
          { id: "l7", title: "Migrations e seeding", duration: "17:30", completed: false, locked: true },
          { id: "l8", title: "Queries complexas e relações", duration: "28:45", completed: false, locked: true },
          { id: "l9", title: "Transactions e otimização", duration: "22:20", completed: false, locked: true },
        ],
      },
    ],
  },
];

export const getCourseById = (id: string): Course | undefined =>
  mockCourses.find((c) => c.id === id);

export const getInProgressCourses = (): Course[] =>
  mockCourses.filter((c) => c.progress > 0 && c.progress < 100);

export const getNewCourses = (): Course[] =>
  mockCourses.filter((c) => c.isNew);

export const getPopularCourses = (): Course[] =>
  [...mockCourses].sort((a, b) => b.students - a.students);

export const getFeaturedCourse = (): Course | undefined =>
  mockCourses.find((c) => c.isFeatured);
