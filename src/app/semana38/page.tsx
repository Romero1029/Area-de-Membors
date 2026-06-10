import { SemanaDespertar38 } from '@/app/(member)/lancamento/SemanaDespertar38'

export default function Semana38Page({
  searchParams,
}: {
  searchParams: { nome?: string }
}) {
  const firstName = (searchParams.nome ?? '').split(' ')[0] || ''
  return <SemanaDespertar38 firstName={firstName} />
}
