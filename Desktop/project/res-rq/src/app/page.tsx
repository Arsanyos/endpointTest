import Image from "next/image";

import { Avatar } from "@/components/Avatar";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center">
      <div className="absolute flex flex-col items-center justify-center gap-12 z-10">
        <p className=" text-5xl font-bold text-white ">Kaldis Coffee</p>
        <Avatar />
      </div>
      <div className="absolute inset-0 -z-10 h-full w-full">
        <Image
          src="/background/background.svg"
          alt="background-fruits-image"
          fill
          priority={false}
          loading="lazy"
          className="object-cover brightness-50"
        />
      </div>
    </main>
  );
}

