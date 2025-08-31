
import { FaHandPaper, FaHistory, FaUserCog } from "react-icons/fa";
import type { TabKey } from "../types";

type Props = {
  active: TabKey;
  onChange: (key: TabKey) => void;
};

export default function BottomNav({ active, onChange }: Props) {
  return (
    <nav className="fixed inset-x-0 bottom-4 z-50 mx-auto w-fit rounded-full bg-content1/80 px-8 py-3 shadow-lg backdrop-blur supports-[padding:max(0px)]:pb-[max(env(safe-area-inset-bottom),12px)]">
      <div className="flex items-center justify-center gap-6">
        <button onClick={() => onChange("request")} className={`flex items-center gap-2 text-md font-semibold ${active === "request" ? "text-success" : "text-foreground/70"}`}>
          <FaHandPaper size={20} />
          Solicitar
        </button>
        <button onClick={() => onChange("history")} className={`flex items-center gap-2 text-md ${active === "history" ? "text-success" : "text-foreground/70"}`}>
          <FaHistory size={20} />
          Historial
        </button>
        <button onClick={() => onChange("account")} className={`flex items-center gap-2 text-md ${active === "account" ? "text-success" : "text-foreground/70"}`}>
          <FaUserCog size={20} />
          Mi cuenta
        </button>
      </div>
    </nav>
  );
}
