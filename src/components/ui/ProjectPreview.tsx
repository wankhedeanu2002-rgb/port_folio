import { motion } from "framer-motion";

interface ProjectPreviewProps {
  projectId: string;
  reduced?: boolean;
}

export function ProjectPreview({ projectId, reduced }: ProjectPreviewProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-black/50 p-4 font-mono text-[10px] leading-relaxed text-zinc-500">
      <p className="mb-2 text-[9px] tracking-widest text-zinc-600 uppercase">
        Interactive Product Preview
      </p>
      {projectId === "challan-flow" && <ChallanPreview reduced={reduced} />}
      {projectId === "vehicle-intelligence-api" && <ApiPreview reduced={reduced} />}
      {projectId === "vehicle-api-monitoring" && <MonitorPreview reduced={reduced} />}
    </div>
  );
}

function ChallanPreview({ reduced }: { reduced?: boolean }) {
  return (
    <div className="space-y-3">
      <p className="text-xs text-zinc-400">CHALLAN FLOW</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {["Total", "Processing", "Failed", "Success"].map((s) => (
          <div key={s} className="rounded border border-[var(--color-border)] p-2 text-center">
            <p className="text-[10px] text-zinc-600">{s}</p>
            <p className="mt-1 text-zinc-400">—</p>
          </div>
        ))}
      </div>
      <div>
        <p className="mb-1 text-[9px] text-zinc-600">Recent Challans</p>
        {["MH12...", "MH14...", "MH01..."].map((c, i) => (
          <motion.div
            key={c}
            className="border-b border-[var(--color-border)] py-1 text-zinc-500"
            initial={reduced ? false : { opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            {c}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ApiPreview({ reduced }: { reduced?: boolean }) {
  return (
    <div className="space-y-2">
      <p className="text-emerald-500/70">POST /api/v1/vehicle_lookup</p>
      <div className="rounded border border-[var(--color-border)] p-2">
        <p className="text-[9px] text-zinc-600">REQUEST</p>
        <p>{`{ identifier: "MH12..." }`}</p>
      </div>
      <div className="flex flex-col items-center gap-1 py-1 text-zinc-600">
        {["FASTAPI", "REDIS", "UPSTREAM"].map((step, i) => (
          <motion.div
            key={step}
            className="flex flex-col items-center"
            initial={reduced ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + i * 0.15 }}
          >
            <span>↓</span>
            <span className="rounded border border-indigo-500/20 bg-indigo-500/5 px-2 py-0.5 text-indigo-400/80">
              {step}
            </span>
          </motion.div>
        ))}
      </div>
      <div className="rounded border border-[var(--color-border)] p-2">
        <p className="text-[9px] text-zinc-600">RESPONSE</p>
        <p>{`{ response_code: 101 }`}</p>
      </div>
    </div>
  );
}

function MonitorPreview({ reduced }: { reduced?: boolean }) {
  return (
    <div className="space-y-3">
      <p className="text-xs text-zinc-400">API MONITOR</p>
      <div className="space-y-1">
        {["LOOKUP", "OPERATIONS", "TRANSACTIONS"].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <span className="text-zinc-500">{s}</span>
            <span className="text-emerald-500">●</span>
          </div>
        ))}
      </div>
      <div>
        <p className="text-[9px] text-zinc-600">SUCCESS RATE</p>
        <div className="mt-1 h-2 overflow-hidden rounded bg-zinc-800">
          <motion.div
            className="h-full bg-indigo-500/60"
            initial={reduced ? false : { width: 0 }}
            whileInView={{ width: "85%" }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>
      <div>
        <p className="text-[9px] text-zinc-600">REQUESTS</p>
        <p className="text-lg tracking-widest text-zinc-600">╱╲╱╲╱╲╱╲</p>
      </div>
    </div>
  );
}
