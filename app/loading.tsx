import Image from "next/image";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black/80">
      <div className="flex flex-col items-center gap-4 animate-pulse">
        <Image src="/images/logo.png" alt="Logo" width={80} height={80} />
        <p className="text-gray-500 text-sm">Loading your content...</p>
      </div>
    </div>
  );
}
