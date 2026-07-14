import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedPartnerBySlug } from "@/lib/actions/parceiras";
import { AnimatedBackground } from "@/components/backgrounds/AnimatedBackground";
import { PartnerLinkButton } from "@/components/PartnerLinkButton";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const partner = await getPublishedPartnerBySlug(slug);

  if (!partner) return { title: "Página não encontrada" };

  return {
    title: `${partner.name} | Instituto Despertamente`,
    description: partner.tagline ?? partner.bio ?? undefined,
  };
}

export default async function PartnerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const partner = await getPublishedPartnerBySlug(slug);

  if (!partner || !partner.theme) notFound();

  const links = (partner.links ?? [])
    .filter((l) => l.is_active)
    .sort((a, b) => a.position - b.position);

  const initials = partner.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <main className="relative min-h-screen">
      <div className="fixed inset-0 -z-10">
        <AnimatedBackground theme={partner.theme} />
      </div>

      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center px-6 py-16">
        <div
          className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 text-2xl font-semibold text-white shadow-xl"
          style={{
            borderColor: partner.theme.accent_color,
            background: `linear-gradient(135deg, ${partner.theme.primary_color}, ${partner.theme.secondary_color})`,
          }}
        >
          {partner.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={partner.avatar_url}
              alt={partner.name}
              className="h-full w-full object-cover"
            />
          ) : (
            initials
          )}
        </div>

        <h1 className="font-fraunces mt-5 text-center text-2xl font-semibold text-white">
          {partner.name}
        </h1>

        {partner.tagline && (
          <p className="mt-1 text-center text-sm font-medium text-white/70">{partner.tagline}</p>
        )}

        {partner.bio && (
          <p className="mt-3 text-center text-sm leading-relaxed text-white/60">{partner.bio}</p>
        )}

        <div className="mt-8 flex w-full flex-col gap-3">
          {links.map((link) => (
            <PartnerLinkButton key={link.id} link={link} theme={partner.theme!} />
          ))}
        </div>

        <footer className="mt-16 flex items-center gap-2 text-xs text-white/50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/despertamente-simbolo-branco.png"
            alt="Instituto Despertamente"
            className="h-5 w-5 object-contain"
          />
          em colaboração com Instituto Despertamente
        </footer>
      </div>
    </main>
  );
}
