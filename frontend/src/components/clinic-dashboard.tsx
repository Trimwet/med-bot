import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  Eye,
  Filter,
  LayoutDashboard,
  MessageSquare,
  PieChart,
  RefreshCcw,
  Search,
  Settings,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";

interface TriageStats {
  total: number;
  selfCare: number;
  consult: number;
  emergency: number;
}

interface Session {
  sessionId: string;
  patientId?: string;
  verdict: string;
  channel: string;
  status: string;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
}

interface DailyStat {
  date: string;
  count: number;
  selfCare: number;
  consult: number;
  emergency: number;
}

export function ClinicDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "sessions" | "analytics" | "settings">("overview");
  const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d">("30d");
  const [isLoading, setIsLoading] = useState(true);
  
  const [stats, setStats] = useState<TriageStats>({
    total: 1247,
    selfCare: 623,
    consult: 489,
    emergency: 135,
  });

  const [recentSessions, setRecentSessions] = useState<Session[]>([
    { sessionId: "s_abc123", verdict: "consult", channel: "web", status: "completed", messageCount: 8, createdAt: "2024-01-15T10:30:00Z", updatedAt: "2024-01-15T10:45:00Z" },
    { sessionId: "s_def456", verdict: "self_care", channel: "embed", status: "completed", messageCount: 5, createdAt: "2024-01-15T09:15:00Z", updatedAt: "2024-01-15T09:25:00Z" },
    { sessionId: "s_ghi789", verdict: "emergency", channel: "web", status: "completed", messageCount: 3, createdAt: "2024-01-15T08:45:00Z", updatedAt: "2024-01-15T08:50:00Z" },
    { sessionId: "s_jkl012", verdict: "consult", channel: "whatsapp", status: "in_progress", messageCount: 12, createdAt: "2024-01-15T11:00:00Z", updatedAt: "2024-01-15T11:30:00Z" },
    { sessionId: "s_mno345", verdict: "self_care", channel: "embed", status: "completed", messageCount: 4, createdAt: "2024-01-14T16:20:00Z", updatedAt: "2024-01-14T16:28:00Z" },
  ]);

  const [dailyStats, setDailyStats] = useState<DailyStat[]>([
    { date: "2024-01-09", count: 32, selfCare: 16, consult: 12, emergency: 4 },
    { date: "2024-01-10", count: 45, selfCare: 22, consult: 18, emergency: 5 },
    { date: "2024-01-11", count: 38, selfCare: 19, consult: 15, emergency: 4 },
    { date: "2024-01-12", count: 52, selfCare: 26, consult: 20, emergency: 6 },
    { date: "2024-01-13", count: 41, selfCare: 20, consult: 16, emergency: 5 },
    { date: "2024-01-14", count: 48, selfCare: 24, consult: 19, emergency: 5 },
    { date: "2024-01-15", count: 55, selfCare: 28, consult: 21, emergency: 6 },
  ]);

  const [branding, setBranding] = useState({
    primaryColor: "#00A8A8",
    secondaryColor: "#073B4C",
    logoUrl: "",
    welcomeMessage: "Hello! How can I help you today?",
    theme: "light" as "light" | "dark",
  });

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [dateRange]);

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case "self_care": return "text-green-600 bg-green-50";
      case "consult": return "text-amber-600 bg-amber-50";
      case "emergency": return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case "self_care": return <CheckCircle className="w-4 h-4" />;
      case "consult": return <AlertTriangle className="w-4 h-4" />;
      case "emergency": return <XCircle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-NG", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#00A8A8] rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-[#073B4C]">Clinic Dashboard</h1>
                <p className="text-xs text-gray-500">Manage your MedBot integration</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                {(["7d", "30d", "90d"] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setDateRange(range)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                      dateRange === range
                        ? "bg-white text-[#073B4C] shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : "90 Days"}
                  </button>
                ))}
              </div>
              
              <button className="flex items-center gap-2 px-4 py-2 bg-[#00A8A8] text-white rounded-lg hover:bg-[#008f8f] transition-colors">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-1 -mb-px">
            {[
              { id: "overview", label: "Overview", icon: LayoutDashboard },
              { id: "sessions", label: "Sessions", icon: MessageSquare },
              { id: "analytics", label: "Analytics", icon: PieChart },
              { id: "settings", label: "Embed Settings", icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-[#00A8A8] text-[#00A8A8]"
                    : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-12"
            >
              <RefreshCcw className="w-6 h-6 text-[#00A8A8] animate-spin" />
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Total Assessments</p>
                          <p className="text-3xl font-bold text-[#073B4C]">{stats.total.toLocaleString()}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                          <Users className="w-6 h-6 text-blue-600" />
                        </div>
                      </div>
                      <div className="mt-3 flex items-center text-sm text-green-600">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        <span>+12.5% from last period</span>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Self-Care</p>
                          <p className="text-3xl font-bold text-green-600">{stats.selfCare}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-gray-500">
                        {((stats.selfCare / stats.total) * 100).toFixed(1)}% of assessments
                      </p>
                    </div>
                    
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Consult Doctor</p>
                          <p className="text-3xl font-bold text-amber-600">{stats.consult}</p>
                        </div>
                        <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center">
                          <AlertTriangle className="w-6 h-6 text-amber-600" />
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-gray-500">
                        {((stats.consult / stats.total) * 100).toFixed(1)}% of assessments
                      </p>
                    </div>
                    
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Emergency</p>
                          <p className="text-3xl font-bold text-red-600">{stats.emergency}</p>
                        </div>
                        <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                          <XCircle className="w-6 h-6 text-red-600" />
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-gray-500">
                        {((stats.emergency / stats.total) * 100).toFixed(1)}% of assessments
                      </p>
                    </div>
                  </div>

                  {/* Chart Placeholder */}
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-[#073B4C]">Triage Trends</h3>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          <span className="text-gray-600">Self-Care</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                          <span className="text-gray-600">Consult</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <span className="text-gray-600">Emergency</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Simple bar chart */}
                    <div className="h-48 flex items-end gap-2">
                      {dailyStats.map((stat, i) => (
                        <div key={i} className="flex-1 flex flex-col gap-1">
                          <div className="flex gap-1" style={{ height: "100%" }}>
                            <div
                              className="flex-1 bg-green-500 rounded-t"
                              style={{ height: `${(stat.selfCare / stat.count) * 100}%` }}
                            ></div>
                            <div
                              className="flex-1 bg-amber-500 rounded-t"
                              style={{ height: `${(stat.consult / stat.count) * 100}%` }}
                            ></div>
                            <div
                              className="flex-1 bg-red-500 rounded-t"
                              style={{ height: `${(stat.emergency / stat.count) * 100}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 text-center">
                            {new Date(stat.date).toLocaleDateString("en-NG", { weekday: "short" })}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Sessions */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="p-5 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-[#073B4C]">Recent Sessions</h3>
                        <button
                          onClick={() => setActiveTab("sessions")}
                          className="text-sm text-[#00A8A8] hover:underline"
                        >
                          View all
                        </button>
                      </div>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {recentSessions.slice(0, 5).map((session) => (
                        <div key={session.sessionId} className="p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${getVerdictColor(session.verdict)}`}>
                                {getVerdictIcon(session.verdict)}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  Session {session.sessionId.slice(0, 12)}...
                                </p>
                                <p className="text-xs text-gray-500">
                                  {session.channel} · {session.messageCount} messages
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className={`text-sm font-medium capitalize ${getVerdictColor(session.verdict).split(" ")[0]}`}>
                                {session.verdict.replace("_", " ")}
                              </p>
                              <p className="text-xs text-gray-500">{formatDate(session.createdAt)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "sessions" && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="p-5 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-[#073B4C]">All Sessions</h3>
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search sessions..."
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00A8A8]"
                          />
                        </div>
                        <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
                          <Filter className="w-4 h-4" />
                          Filter
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="text-left p-4 text-sm font-medium text-gray-600">Session</th>
                          <th className="text-left p-4 text-sm font-medium text-gray-600">Channel</th>
                          <th className="text-left p-4 text-sm font-medium text-gray-600">Verdict</th>
                          <th className="text-left p-4 text-sm font-medium text-gray-600">Status</th>
                          <th className="text-left p-4 text-sm font-medium text-gray-600">Messages</th>
                          <th className="text-left p-4 text-sm font-medium text-gray-600">Created</th>
                          <th className="text-left p-4 text-sm font-medium text-gray-600">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentSessions.map((session) => (
                          <tr key={session.sessionId} className="border-b border-gray-50 hover:bg-gray-50">
                            <td className="p-4">
                              <span className="text-sm font-medium text-gray-900">{session.sessionId}</span>
                            </td>
                            <td className="p-4">
                              <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded capitalize">
                                {session.channel}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className={`px-2 py-1 text-xs font-medium rounded ${getVerdictColor(session.verdict)}`}>
                                {session.verdict.replace("_", " ")}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className={`text-sm ${session.status === "completed" ? "text-green-600" : "text-amber-600"}`}>
                                {session.status}
                              </span>
                            </td>
                            <td className="p-4 text-sm text-gray-600">{session.messageCount}</td>
                            <td className="p-4 text-sm text-gray-600">{formatDate(session.createdAt)}</td>
                            <td className="p-4">
                              <button className="p-1 hover:bg-gray-100 rounded">
                                <Eye className="w-4 h-4 text-gray-600" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "analytics" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Channel Distribution */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                      <h3 className="text-lg font-semibold text-[#073B4C] mb-4">Channel Distribution</h3>
                      <div className="space-y-4">
                        {[
                          { channel: "Web Widget", count: 523, percent: 42 },
                          { channel: "Embed", count: 412, percent: 33 },
                          { channel: "WhatsApp", count: 218, percent: 17 },
                          { channel: "API", count: 94, percent: 8 },
                        ].map((item) => (
                          <div key={item.channel}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm text-gray-600">{item.channel}</span>
                              <span className="text-sm font-medium text-gray-900">{item.count} ({item.percent}%)</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                              <div
                                className="bg-[#00A8A8] h-2 rounded-full"
                                style={{ width: `${item.percent}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Peak Hours */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                      <h3 className="text-lg font-semibold text-[#073B4C] mb-4">Peak Hours</h3>
                      <div className="grid grid-cols-6 gap-2">
                        {Array.from({ length: 24 }, (_, i) => {
                          const hour = i;
                          const isPeak = hour >= 8 && hour <= 17;
                          const intensity = isPeak ? Math.random() * 50 + 50 : Math.random() * 30;
                          return (
                            <div
                              key={hour}
                              className="aspect-square rounded flex items-center justify-center text-xs"
                              style={{
                                backgroundColor: `rgba(0, 168, 168, ${intensity / 100})`,
                                color: intensity > 50 ? "white" : "#073B4C",
                              }}
                              title={`${hour}:00 - ${Math.round(intensity * 1.2)} sessions`}
                            >
                              {hour % 6 === 0 ? `${hour}` : ""}
                            </div>
                          );
                        })}
                      </div>
                      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                        <span>12 AM</span>
                        <span>6 AM</span>
                        <span>12 PM</span>
                        <span>6 PM</span>
                        <span>11 PM</span>
                      </div>
                    </div>
                  </div>

                  {/* Emergency Alerts */}
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-[#073B4C]">Emergency Escalations</h3>
                        <p className="text-sm text-gray-500">{stats.emergency} patients flagged this period</p>
                      </div>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-sm text-red-800">
                        <strong>Important:</strong> Emergency cases are automatically flagged and require immediate attention.
                        Ensure your team is monitoring the dashboard for real-time alerts.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "settings" && (
                <div className="space-y-6">
                  {/* Embed Code */}
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-[#073B4C] mb-4">Embed Code</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Add this code to your website to embed the MedBot triage widget.
                    </p>
                    <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm text-green-400 font-mono">
{`<script
  src="https://embed.medbot.ng/v1.js"
  data-tenant="your-clinic-id"
  data-theme="${branding.theme}"
  data-locale="en-NG"
  data-title="Medical Triage"
  data-subtitle="AI-powered health assessment"
  data-welcome="${branding.welcomeMessage}"
  data-primary-color="${branding.primaryColor}"
  data-secondary-color="${branding.secondaryColor}">
</script>`}
                      </pre>
                    </div>
                    <button className="mt-4 px-4 py-2 bg-[#00A8A8] text-white rounded-lg text-sm hover:bg-[#008f8f] transition-colors">
                      Copy Code
                    </button>
                  </div>

                  {/* Branding */}
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-[#073B4C] mb-4">Branding</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Primary Color
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            value={branding.primaryColor}
                            onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                            className="w-10 h-10 rounded border border-gray-200 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={branding.primaryColor}
                            onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00A8A8]"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Secondary Color
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            value={branding.secondaryColor}
                            onChange={(e) => setBranding({ ...branding, secondaryColor: e.target.value })}
                            className="w-10 h-10 rounded border border-gray-200 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={branding.secondaryColor}
                            onChange={(e) => setBranding({ ...branding, secondaryColor: e.target.value })}
                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00A8A8]"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Welcome Message
                        </label>
                        <input
                          type="text"
                          value={branding.welcomeMessage}
                          onChange={(e) => setBranding({ ...branding, welcomeMessage: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00A8A8]"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Theme
                        </label>
                        <select
                          value={branding.theme}
                          onChange={(e) => setBranding({ ...branding, theme: e.target.value as any })}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00A8A8]"
                        >
                          <option value="light">Light</option>
                          <option value="dark">Dark</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex gap-3">
                      <button className="px-4 py-2 bg-[#00A8A8] text-white rounded-lg text-sm hover:bg-[#008f8f] transition-colors">
                        Save Changes
                      </button>
                      <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                        Reset to Default
                      </button>
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-[#073B4C] mb-4">Widget Preview</h3>
                    <div className="border border-gray-200 rounded-lg p-8 bg-gray-50 flex items-center justify-center min-h-[400px]">
                      <div className="text-center">
                        <div
                          className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg"
                          style={{ backgroundColor: branding.primaryColor }}
                        >
                          <MessageSquare className="w-8 h-8 text-white" />
                        </div>
                        <p className="text-sm text-gray-600">
                          Widget preview will appear here
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
