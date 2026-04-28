"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Info,
  BookOpen,
  AlertTriangle,
  ShieldCheck,
  Database,
  User,
  CalendarDays,
  Stethoscope,
  Pill,
  History,
  MessageSquare,
  ChevronLeft,
} from "lucide-react";

type TabType = "about" | "guide" | "warning" | "advice";

const aboutItems = [
  {
    icon: <Pill className="w-5 h-5" />,
    label: "Системийн зорилго",
    value:
      "Энэхүү систем нь хоёр эмийн хоорондын харилцан үйлчлэлийг илрүүлж, эрсдэлийн түвшин болон тайлбарыг ойлгомжтой байдлаар харуулах зорилготой.",
  },
  {
    icon: <Stethoscope className="w-5 h-5" />,
    label: "Хэнд зориулсан бэ?",
    value:
      "Эмч, эмийн зүйч, анагаахын чиглэлийн оюутан болон энгийн хэрэглэгч ашиглах боломжтой.",
  },
  {
    icon: <Database className="w-5 h-5" />,
    label: "Өгөгдлийн эх сурвалж",
    value:
      "Системийн үндсэн өгөгдлийг DrugBank мэдээллийн сангаас боловсруулан ашигласан.",
  },
  {
    icon: <User className="w-5 h-5" />,
    label: "Хөгжүүлэгч / холбоо",
    value: "Хөгжүүлэгч: Khozybek.",
  },
  {
    icon: <Info className="w-5 h-5" />,
    label: "Хувилбар",
    value: "Version 1.0",
  },
  {
    icon: <CalendarDays className="w-5 h-5" />,
    label: "Шинэчлэлтийн огноо",
    value: "2026-04-15",
  },
];

const guideSteps = [
  "Эмийн нэрийг Монгол нэр эсвэл INN нэрээр хайна.",
  "Жагсаалтаас эхний эмийг сонгоно.",
  "Хоёр дахь эмийг мөн адил хайж сонгоно.",
  '"Шалгах" товчийг дарна.',
  "Гарсан үр дүнгээс эрсдэлийн түвшин болон тайлбарыг уншина.",
  "Өмнөх шалгалтуудаа түүх хэсгээс харж болно.",
  "Санал хүсэлт хэсгээр дамжуулан санал илгээж болно.",
];

const riskLevels = [
  {
    label: "Өндөр эрсдэл",
    desc: "Ноцтой сөрөг нөлөө үүсэх магадлалтай.",
    color: "text-red-600",
  },
  {
    label: "Дунд эрсдэл",
    desc: "Болгоомжтой хэрэглэх шаардлагатай.",
    color: "text-amber-600",
  },
  {
    label: "Бага эрсдэл",
    desc: "Харьцангуй бага эрсдэлтэй.",
    color: "text-green-600",
  },
];

const warningItems = [
  "Энэхүү систем нь эмч, эмийн зүйчийн зөвлөгөөг орлохгүй.",
  "Гарсан үр дүн нь зөвхөн лавлагааны зориулалттай.",
  "Бүх эмийн мэдээлэл бүрэн агуулагдаагүй байж болно.",
  "Эмийн тун, хэрэглэх хугацаа, хүний биеийн онцлогоос шалтгаалан үр дүн өөр байж болно.",
];

const adviceItems = [
  "Эм хэрэглэхээсээ өмнө эмч, эмийн зүйчтэй зөвлөлдөнө үү.",
  "Эмийн тунг өөрийн дураар өөрчлөхгүй байх хэрэгтэй.",
  "Гаж нөлөө илэрвэл мэргэжлийн хүнд яаралтай хандана уу.",
  "Эмийн санд эм авахдаа хэрэглэж буй бусад эмийнхээ талаар мэдэгдэж зөвлөгөө аваарай.",
];

const stats = [
  { label: "Хувилбар", value: "v1.0", sub: "2026-04-15 шинэчлэлт" },
  { label: "Эх сурвалж", value: "DrugBank", sub: "Баталгаажсан мэдээлэл" },
  { label: "Алхам", value: "7", sub: "Ашиглах заавар" },
];

const tabs = [
  { id: "about" as TabType, label: "Системийн тухай", icon: Info },
  { id: "guide" as TabType, label: "Заавар", icon: BookOpen },
  { id: "warning" as TabType, label: "Анхааруулга", icon: AlertTriangle },
  { id: "advice" as TabType, label: "Зөвлөмж", icon: ShieldCheck },
];

const tabActiveStyles: Record<TabType, string> = {
  about: "bg-blue-600 border-blue-600 text-white shadow-sm",
  guide: "bg-blue-600 border-blue-600 text-white shadow-sm",
  warning: "bg-red-500 border-red-500 text-white shadow-sm",
  advice: "bg-green-600 border-green-600 text-white shadow-sm",
};

export default function SystemInfoPage() {
  const [activeTab, setActiveTab] = useState<TabType>("guide");
  const router = useRouter();

  return (
    <div className="w-full max-w-5xl mx-auto px-3 md:px-6 py-5 md:py-10">
      {/* Header */}
      <div className="mb-4 md:mb-6">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center active:scale-95 transition-all duration-150 shrink-0 group"
          >
            <ChevronLeft className="w-5 h-5 text-slate-400 group-hover:text-slate-700 group-hover:-translate-x-0.5 transition-all duration-150" />
          </button>
          <h1 className="text-xl md:text-3xl font-bold text-slate-900">
            Системийн мэдээлэл
          </h1>
        </div>
      </div>

      {/* System Description Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6 mb-4 md:mb-6 shadow-sm">
        <div className="flex items-start gap-3 md:gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm md:text-base font-semibold text-slate-900 mb-1">
              Эмийн харилцан үйлчлэл шалгах систем
            </h2>
            <p className="text-xs md:text-sm text-slate-600 leading-5 md:leading-6">
              Энэ систем нь хоёр эмийн хоорондын харилцан үйлчлэлийг илрүүлж,
              эрсдэлийн түвшин болон тайлбарыг ойлгомжтой байдлаар харуулдаг.{" "}
              <strong className="text-slate-800">DrugBank</strong> мэдээллийн
              сангийн өгөгдөлд тулгуурлан боловсруулагдсан.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-4 md:mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`h-11 md:h-[52px] rounded-xl md:rounded-2xl border-2 transition-all duration-200 flex items-center justify-center gap-1.5 md:gap-2 text-xs md:text-[15px] font-medium ${
                isActive
                  ? tabActiveStyles[tab.id]
                  : "bg-white border-slate-200 text-slate-500 hover:border-slate-400 hover:text-slate-800 hover:bg-slate-50 hover:shadow-sm active:scale-95"
              }`}
            >
              <Icon className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" />
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content card */}
      <div className="rounded-2xl md:rounded-[24px] border border-slate-200 bg-white p-4 md:p-8 shadow-sm min-h-[420px]">
        {activeTab === "about" && <AboutTab />}
        {activeTab === "guide" && <GuideTab />}
        {activeTab === "warning" && <WarningTab />}
        {activeTab === "advice" && <AdviceTab />}
      </div>
    </div>
  );
}

function SectionTitle({
  icon,
  title,
  subtitle,
  iconBg = "bg-slate-100",
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  iconBg?: string;
}) {
  return (
    <div className="mb-4 md:mb-6">
      <div className="flex items-center gap-2.5 md:gap-3">
        <div
          className={`w-9 h-9 md:w-11 md:h-11 rounded-xl md:rounded-2xl ${iconBg} border border-slate-200 flex items-center justify-center shrink-0`}
        >
          {icon}
        </div>
        <div>
          <h2 className="text-lg md:text-2xl font-semibold text-slate-900">
            {title}
          </h2>
          <p className="text-slate-500 text-xs md:text-sm mt-0.5">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 text-slate-500">{icon}</div>
        <div>
          <h3 className="font-semibold text-[15px] text-slate-900 mb-1">
            {label}
          </h3>
          <div className="text-slate-600 text-sm leading-6">{value}</div>
        </div>
      </div>
    </div>
  );
}

function AboutTab() {
  return (
    <div>
      <SectionTitle
        icon={<Info className="w-5 h-5 text-blue-600" />}
        title="Системийн тухай"
        subtitle="Системийн зорилго, зориулалт, эх сурвалж болон хувилбарын мэдээлэл"
        iconBg="bg-blue-50"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {aboutItems.map((item) => (
          <InfoItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            value={item.value}
          />
        ))}
      </div>
    </div>
  );
}

function GuideTab() {
  return (
    <div>
      <SectionTitle
        icon={<BookOpen className="w-5 h-5 text-blue-600" />}
        title="Заавар"
        subtitle="Системийг хэрхэн ашиглах алхмууд"
        iconBg="bg-blue-50"
      />
      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h3 className="font-semibold text-slate-900 mb-4">Ашиглах алхмууд</h3>
          <div className="space-y-3 md:space-y-4">
            {guideSteps.map((item, index) => (
              <div key={index} className="flex items-start gap-2.5 md:gap-3">
                <div className="w-6 h-6 md:w-7 md:h-7 shrink-0 rounded-full bg-blue-600 text-white text-xs md:text-sm font-semibold flex items-center justify-center">
                  {index + 1}
                </div>
                <p className="text-xs md:text-sm text-slate-700 leading-5 md:leading-6">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <h3 className="font-semibold text-slate-900 mb-3">
            Үр дүнг хэрхэн ойлгох вэ?
          </h3>
          <div className="space-y-2 text-sm text-slate-700">
            {riskLevels.map((r) => (
              <p key={r.label}>
                <span className={`font-semibold ${r.color}`}>{r.label}</span> —{" "}
                {r.desc}
              </p>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem
            icon={<History className="w-5 h-5" />}
            label="Түүх харах"
            value="Өмнө шалгасан харилцан үйлчлэлийн жагсаалтыг түүх хэсгээс харж болно."
          />
          <InfoItem
            icon={<MessageSquare className="w-5 h-5" />}
            label="Санал хүсэлт илгээх"
            value="Системийн алдаа, санал, сайжруулалтын хүсэлтээ илгээж болно."
          />
        </div>
      </div>
    </div>
  );
}

function WarningTab() {
  return (
    <div>
      <SectionTitle
        icon={<AlertTriangle className="w-5 h-5 text-red-500" />}
        title="Анхааруулга"
        subtitle="Чухал мэдэгдэл болон хязгаарлалтын мэдээлэл"
        iconBg="bg-red-50"
      />
      <div className="space-y-4">
        {warningItems.map((item, index) => (
          <div
            key={index}
            className="rounded-2xl border border-red-200 bg-red-50 p-4"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
              <p className="text-sm text-slate-700 leading-6">{item}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdviceTab() {
  return (
    <div>
      <SectionTitle
        icon={<ShieldCheck className="w-5 h-5 text-green-600" />}
        title="Зөвлөмж"
        subtitle="Эм хэрэглэх үед баримтлах зөвлөмжүүд"
        iconBg="bg-green-50"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {adviceItems.map((item, index) => (
          <div
            key={index}
            className="rounded-2xl border border-green-200 bg-green-50 p-5"
          >
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
              <p className="text-sm text-slate-700 leading-6">{item}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
