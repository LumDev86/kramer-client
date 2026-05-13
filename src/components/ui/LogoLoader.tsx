import Image from 'next/image';

interface LogoLoaderProps {
  size?: number;
  fullScreen?: boolean;
}

export default function LogoLoader({ size = 72, fullScreen = false }: LogoLoaderProps) {
  const loader = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className="rounded-full bg-white shadow-lg flex items-center justify-center"
        style={{
          width: size + 16,
          height: size + 16,
          animation: 'spin 1.8s linear infinite',
        }}
      >
        <Image
          src="/logo.png"
          alt="Cargando..."
          width={size}
          height={size}
          className="rounded-full"
        />
      </div>
      <p className="text-sm text-gray-400 font-medium tracking-wide">Cargando...</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {loader}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-16">
      {loader}
    </div>
  );
}
