import Image from 'next/image';
import elephant from '@/design/assets/elephant-navy.png';

export function BrandLockup() {
  return (
    <span className="inline-flex items-center gap-2">
      <Image src={elephant} alt="" width={28} height={28} priority />
      <span className="font-sans text-h3 font-bold text-navy">Herd Learn</span>
    </span>
  );
}
