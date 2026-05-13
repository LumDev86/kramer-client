import LogoLoader from '@/components/ui/LogoLoader';

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <LogoLoader size={80} />
    </div>
  );
}
