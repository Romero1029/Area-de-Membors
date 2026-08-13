import { NpaPresencialClient } from "./NpaPresencialClient";

export const dynamic = "force-dynamic";

export default function NpaPresencialPage({ params }: { params: { slug: string } }) {
  return <NpaPresencialClient slug={params.slug} />;
}
