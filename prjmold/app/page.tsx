import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata(
  "Luminárias autorais em 3D",
  "Conheça a Mol·D: luminárias e objetos de design criados em 3D para transformar ambientes em refúgios de bem-estar.",
  "/",
);

export default function Home() {
  return (
    <>
      <section className="relative flex h-screen items-center overflow-hidden bg-black/60 px-[8%]">

        <div className="relative z-10 max-w-175">
          <span className="mb-4 block text-[10px] font-medium uppercase tracking-[5px] text-[#FFCD92]">
            Estúdio Mol·D
          </span>

          <h1 className="mb-5 text-[clamp(50px,10vw,110px)] leading-[0.9] text-[#FFCD92]">
            LUZ QUE
            <br />
            ACOLHE.
          </h1>

          <p className="mb-10 max-w-105 text-base text-white/80">
            Luminárias criadas em 3D com texturas orgânicas para transformar seu ambiente em um refúgio de bem-estar.
          </p>

          <div className="flex gap-5">
            <a
              href="/products"
              className="border border-[#FFCD92]/40 px-8 py-3 text-xs uppercase tracking-[2px] text-[#FFCD92] transition hover:bg-[#FFCD92] hover:text-black"
            >
              Ver Peças
            </a>

            <a
              href="/about"
              className="border border-white/20 px-8 py-3 text-xs uppercase tracking-[2px] text-white transition hover:border-[#FFCD92] hover:bg-[#FFCD92] hover:text-black"
            >
              Manifesto
            </a>
          </div>
        </div>
      </section>
    </>
  );
}