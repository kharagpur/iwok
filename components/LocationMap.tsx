import { site } from "@/data/site";

// A simple stick map of the block: Kingsway, Royal Oak Ave, the row of shops with Indian Wok
// second from the corner, and the parking lot behind it. Drawn as inline SVG, so it's sharp at
// any size and costs nothing to download. Layout checked against Google Maps (2026-11-08).

// Kingsway runs down to the east; its south curb is y = 92 + 0.35x in this drawing.
const curb = (x: number) => 92 + 0.35 * x;

// The row of shops along the south side of Kingsway, west to east.
const shops = [
  { x1: 189, x2: 270, bottom: 336 }, // corner building (runs south along Royal Oak)
  { x1: 274, x2: 376, bottom: 292, us: true }, // Indian Wok
  { x1: 380, x2: 452, bottom: 300 },
  { x1: 456, x2: 528, bottom: 318 },
];

const shopPath = (s: { x1: number; x2: number; bottom: number }) =>
  `M${s.x1},${curb(s.x1) + 4} L${s.x2},${curb(s.x2) + 4} L${s.x2},${s.bottom} L${s.x1},${s.bottom} Z`;

export function LocationMap() {
  const us = shops[1];
  const usTop = curb((us.x1 + us.x2) / 2) + 4;
  return (
    <figure className="m-0">
      <svg
        viewBox="0 0 640 420"
        role="img"
        aria-labelledby="map-title map-desc"
        className="h-auto w-full rounded-3xl border border-line bg-white"
      >
        <title id="map-title">Map: Indian Wok at Kingsway and Royal Oak</title>
        <desc id="map-desc">
          Indian Wok is on the south side of Kingsway, the second building east of Royal Oak Avenue. {site.parking.text}
        </desc>

        {/* Parking lot behind the shops, and the driveway in from Royal Oak */}
        <path d="M186,346 L274,346 L274,300 L620,300 L620,404 L186,404 Z" fill="#eaf1e2" />
        <g stroke="#c9d8b8" strokeWidth="2">
          {[300, 330, 360, 390].map((x) => (
            <line key={x} x1={x} y1={350} x2={x} y2={400} />
          ))}
        </g>
        <path
          d="M196,372 L262,372"
          stroke="var(--color-leaf)"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
          markerEnd="url(#arrow)"
        />
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4" markerHeight="4" orient="auto">
            <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-leaf)" />
          </marker>
        </defs>
        <circle cx="436" cy="366" r="21" fill="var(--color-leaf)" />
        <text x="436" y="375" textAnchor="middle" fontSize="25" fontWeight="800" fill="#fff">
          P
        </text>
        <text x="466" y="360" fontSize="22" fontWeight="800" fill="var(--color-leaf)">
          Parking
        </text>
        <text x="466" y="386" fontSize="22" fontWeight="800" fill="var(--color-leaf)">
          at the back
        </text>

        {/* Roads */}
        <rect x="150" y="0" width="36" height="420" fill="#e9e4e0" />
        <path d={`M0,${curb(0) - 44} L640,${curb(640) - 44} L640,${curb(640)} L0,${curb(0)} Z`} fill="#e9e4e0" />
        <line x1="168" y1="0" x2="168" y2="420" stroke="#fff" strokeWidth="2" strokeDasharray="10 9" />
        <line x1="0" y1={curb(0) - 22} x2="640" y2={curb(640) - 22} stroke="#fff" strokeWidth="2" strokeDasharray="10 9" />

        {/* Shops */}
        {shops.map((s, i) => (
          <path
            key={i}
            d={shopPath(s)}
            fill={s.us ? "var(--color-chili)" : "#f5f1ee"}
            stroke={s.us ? "var(--color-chili-dark)" : "#d9d0c9"}
            strokeWidth="2"
          />
        ))}
        <text x={(us.x1 + us.x2) / 2} y={usTop + 46} textAnchor="middle" fontSize="23" fontWeight="800" fill="#fff">
          Indian
        </text>
        <text x={(us.x1 + us.x2) / 2} y={usTop + 72} textAnchor="middle" fontSize="23" fontWeight="800" fill="#fff">
          Wok
        </text>

        {/* Front door on Kingsway */}
        <path
          d={`M${(us.x1 + us.x2) / 2 - 12},${usTop - 1} L${(us.x1 + us.x2) / 2 + 12},${usTop + 8}`}
          stroke="#fff"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Street names */}
        <text
          x="0"
          y="0"
          fontSize="22"
          fontWeight="800"
          fill="var(--color-ink)"
          transform={`translate(456 ${curb(456) - 15}) rotate(19.3)`}
        >
          Kingsway
        </text>
        <text
          x="0"
          y="0"
          fontSize="20"
          fontWeight="800"
          fill="var(--color-ink)"
          transform="translate(175 290) rotate(-90)"
          textAnchor="middle"
        >
          Royal Oak Ave
        </text>

        {/* Address label with a pointer to the restaurant */}
        <g>
          <rect x="252" y="14" width="232" height="68" rx="16" fill="var(--color-ink)" />
          <text x="368" y="43" textAnchor="middle" fontSize="22" fontWeight="800" fill="#fff">
            Indian Wok
          </text>
          <text x="368" y="69" textAnchor="middle" fontSize="19" fill="#e9e4e0">
            {site.address.street}
          </text>
          <path d={`M330,82 L${(us.x1 + us.x2) / 2},${usTop + 14}`} stroke="var(--color-ink)" strokeWidth="3" />
          <circle cx={(us.x1 + us.x2) / 2} cy={usTop + 14} r="6" fill="var(--color-ink)" stroke="#fff" strokeWidth="2" />
        </g>

        {/* North arrow */}
        <g transform="translate(596 54)">
          <path d="M0,-26 L12,10 L0,3 L-12,10 Z" fill="var(--color-ink)" />
          <text x="0" y="32" textAnchor="middle" fontSize="19" fontWeight="800" fill="var(--color-ink)">
            N
          </text>
        </g>
      </svg>
      <figcaption className="mt-2 text-sm text-stone">{site.parking.text}</figcaption>
    </figure>
  );
}
