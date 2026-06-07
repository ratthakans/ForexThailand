/**
 * ถ่ายทอดสด — ฝัง YouTube live ผ่าน iframe ทางการ (responsive 16:9)
 * เปิดมุต (mute) อัตโนมัติเพื่อให้สตรีมเล่นได้ตลอด
 */
export function LiveStream({ videoId }: { videoId: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-black shadow-sm">
      <div className="relative aspect-video">
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&playsinline=1&rel=0`}
          title="ถ่ายทอดสด — Forex Thailand"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          loading="lazy"
        />
      </div>
    </div>
  );
}
