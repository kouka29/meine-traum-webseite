import {
  Phone, Calendar, Wrench, Check, Rocket, Zap, Palette, Home, TreePine,
  Square, Leaf, Snowflake, Car, Plus, ClipboardList, Camera, FolderOpen,
  BarChart3, Smartphone, MapPin, Star, Euro, Search, Link2, Users,
  Stethoscope, GraduationCap, Building2, HardHat, Settings, CloudLightning,
  Flame, Bath, Siren, Clock, Cookie, Scale, Trophy, Syringe, Frown,
  Dumbbell, Sun, Sparkles, Armchair, Factory, Sprout, HelpCircle,
  Wrench as Tools, Truck, FileText, Lock, Store, SmartphoneNfc, Map,
  Flower2, Heart, PawPrint, Briefcase, Pencil, Mail, Hammer, Target,
  type LucideIcon,
} from "lucide-react";

/** Map of legacy emoji icons → lucide-react component. */
const MAP: Record<string, LucideIcon> = {
  "📞": Phone,
  "📅": Calendar,
  "🔧": Wrench,
  "✅": Check,
  "✔️": Check,
  "🚀": Rocket,
  "⚡": Zap,
  "🎨": Palette,
  "🏠": Home,
  "🪵": TreePine,
  "🧱": Square,
  "🌿": Leaf,
  "❄️": Snowflake,
  "🚗": Car,
  "➕": Plus,
  "📋": ClipboardList,
  "📸": Camera,
  "📂": FolderOpen,
  "📊": BarChart3,
  "📱": Smartphone,
  "📍": MapPin,
  "⭐": Star,
  "💰": Euro,
  "💸": Euro,
  "🔍": Search,
  "🔗": Link2,
  "👥": Users,
  "👨‍⚕️": Stethoscope,
  "🎓": GraduationCap,
  "🏢": Building2,
  "🏗️": HardHat,
  "👷": HardHat,
  "⚙️": Settings,
  "⛈️": CloudLightning,
  "♨️": Flame,
  "🛁": Bath,
  "🚨": Siren,
  "⏰": Clock,
  "⏱️": Clock,
  "🍪": Cookie,
  "⚖️": Scale,
  "🏆": Trophy,
  "💉": Syringe,
  "😨": Frown,
  "🥊": Dumbbell,
  "☀️": Sun,
  "✨": Sparkles,
  "🪑": Armchair,
  "🏭": Factory,
  "🌱": Sprout,
  "❓": HelpCircle,
  "🛠️": Tools,
  "🚛": Truck,
  "📑": FileText,
  "📜": FileText,
  "🔒": Lock,
  "🏬": Store,
  "📵": SmartphoneNfc,
  "🗺️": Map,
  "💐": Flower2,
  "💒": Heart,
  "🖤": Heart,
  "🐶": PawPrint,
};

const FALLBACK: LucideIcon = Briefcase;

interface Props {
  emoji: string;
  size?: number;
  className?: string;
}

/**
 * Renders the lucide-react icon mapped to a legacy emoji string.
 * Uniform size and color across the marketing surface.
 */
const EmojiIcon = ({ emoji, size = 20, className = "text-primary" }: Props) => {
  const Icon = MAP[emoji] ?? FALLBACK;
  return <Icon size={size} className={className} aria-hidden focusable={false} />;
};

export default EmojiIcon;