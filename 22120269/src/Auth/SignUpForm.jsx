import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SignupForm() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);

    const formData = {
      username: event.target.username.value,
      email: event.target.email.value,
      password: event.target.password.value,
      phone: event.target.phone.value,
      dob: event.target.dob.value,
    };

    const confirmPassword = event.target.confirmPassword.value;

    if (formData.password !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      setIsLoading(false);
      return;
    }

    try {
      await register(formData);
      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert("Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto rounded-3xl shadow-xl border-gray-200 dark:border-gray-800">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Đăng Ký
        </CardTitle>
        <CardDescription className="text-center">
          Tạo tài khoản mới để truy cập đầy đủ tính năng
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              placeholder="Nhập tên đăng nhập"
              required
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              required
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Số điện thoại</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="0901234567"
              required
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dob">Ngày sinh</Label>
            <Input
              id="dob"
              name="dob"
              type="date"
              required
              className="rounded-xl block w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="******"
              required
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="******"
              required
              className="rounded-xl"
            />
          </div>

          <Button
            type="submit"
            className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white mt-4"
            disabled={isLoading}
          >
            {isLoading ? "Đang xử lý..." : "Đăng Ký"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <div className="text-sm text-gray-500">
          Đã có tài khoản?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Đăng nhập ngay
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
