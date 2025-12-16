import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { movieService } from "@/services/api";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Edit2,
  Save,
  Heart,
  Camera,
  ShieldCheck,
  Loader2,
} from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    dob: "",
  });

  const formatDateForInput = (isoDate) => {
    if (!isoDate) return "";
    return isoDate.split("T")[0];
  };

  const formatDateForDisplay = (isoDate) => {
    if (!isoDate) return "Chưa cập nhật";
    try {
      return new Date(isoDate).toLocaleDateString("vi-VN");
    } catch (e) {
      return isoDate;
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await movieService.getProfile();
        const userData = response.data || response;

        setProfile(userData);

        setFormData({
          email: userData.email || "",
          phone: userData.phone || "",
          dob: formatDateForInput(userData.dob),
        });
      } catch (error) {
        console.error("Lỗi tải profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const payload = {
        phone: formData.phone,
        dob: formData.dob,
        email: formData.email,
      };

      console.log("Gửi payload cập nhật:", payload);

      await movieService.updateProfile(payload);

      alert("Cập nhật thông tin thành công!");

      setProfile((prev) => ({ ...prev, ...payload }));
      setIsEditing(false);

      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem(
        "user",
        JSON.stringify({ ...currentUser, ...payload })
      );
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      alert("Cập nhật thất bại. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );

  if (!profile)
    return (
      <div className="text-center py-20">
        Không tìm thấy thông tin người dùng.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 transition-colors">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 text-center border border-gray-100 dark:border-gray-700">
            <div className="relative w-28 h-28 mx-auto mb-4 group">
              <div className="w-full h-full rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-4xl font-bold text-white shadow-lg">
                {profile.username?.charAt(0).toUpperCase()}
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-white dark:bg-gray-700 rounded-full border border-gray-200 dark:border-gray-600 shadow-sm hover:bg-gray-50 transition-colors">
                <Camera
                  size={18}
                  className="text-gray-600 dark:text-gray-300"
                />
              </button>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
              {profile.username}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 bg-gray-100 dark:bg-gray-700 py-1 px-3 rounded-full inline-block">
              {profile.role || "Thành viên"}
            </p>

            <Link
              to="/favorites"
              className="flex items-center justify-center gap-2 w-full py-3 bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl font-bold transition-all group"
            >
              <Heart
                size={20}
                className="group-hover:scale-110 transition-transform"
              />
              Phim Yêu Thích
            </Link>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 md:p-10 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100 dark:border-gray-700">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Hồ sơ cá nhân
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Quản lý thông tin và bảo mật tài khoản
                </p>
              </div>

              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90 rounded-xl font-semibold transition-all shadow-lg shadow-gray-200 dark:shadow-none"
                >
                  <Edit2 size={18} /> Chỉnh sửa
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        email: profile.email || "",
                        phone: profile.phone || "",
                        dob: formatDateForInput(profile.dob),
                      });
                    }}
                    className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-semibold transition-colors shadow-lg shadow-blue-500/30"
                  >
                    {saving ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Save size={18} />
                    )}{" "}
                    Lưu thay đổi
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="grid gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Tên đăng nhập
                </label>
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700 opacity-75">
                  <User size={20} className="text-gray-400" />
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {profile.username}
                  </span>
                  <ShieldCheck
                    size={16}
                    className="text-green-500 ml-auto"
                    title="Đã xác thực"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Email
                </label>
                <div
                  className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                    isEditing
                      ? "bg-white dark:bg-gray-800 border-blue-500 ring-2 ring-blue-500/10"
                      : "bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <Mail
                    size={20}
                    className={isEditing ? "text-blue-500" : "text-gray-400"}
                  />
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-transparent outline-none font-medium text-gray-900 dark:text-white"
                      placeholder="Nhập email của bạn"
                    />
                  ) : (
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {profile.email}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Số điện thoại
                </label>
                <div
                  className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                    isEditing
                      ? "bg-white dark:bg-gray-800 border-blue-500 ring-2 ring-blue-500/10"
                      : "bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <Phone
                    size={20}
                    className={isEditing ? "text-blue-500" : "text-gray-400"}
                  />
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-transparent outline-none font-medium text-gray-900 dark:text-white"
                      placeholder="Nhập số điện thoại"
                    />
                  ) : (
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {profile.phone || "Chưa cập nhật"}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Ngày sinh
                </label>
                <div
                  className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                    isEditing
                      ? "bg-white dark:bg-gray-800 border-blue-500 ring-2 ring-blue-500/10"
                      : "bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <Calendar
                    size={20}
                    className={isEditing ? "text-blue-500" : "text-gray-400"}
                  />
                  {isEditing ? (
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      className="w-full bg-transparent outline-none font-medium text-gray-900 dark:text-white"
                    />
                  ) : (
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {formatDateForDisplay(profile.dob)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
