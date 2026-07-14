import { notFound } from 'next/navigation'
import { getPartnerById, getPartnerThemes } from '@/lib/actions/parceiras'
import { EditarParceiraForm } from '@/components/admin/EditarParceiraForm'

export default async function AdminEditarParceiraPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [partner, themes] = await Promise.all([getPartnerById(id), getPartnerThemes()])

  if (!partner) notFound()

  return <EditarParceiraForm partner={partner} themes={themes} links={partner.links} />
}
