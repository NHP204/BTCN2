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

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    const username = event.target.username.value;
    const password = event.target.password.value;

    const success = await login(username, password);
    setIsLoading(false);

    if (success) {
      navigate("/");
    } else {
      setError("Tên đăng nhập hoặc mật khẩu không đúng!");
    }
  }

  return (
    <Card className="w-full max-w-sm mx-auto rounded-3xl shadow-lg border-gray-200 dark:border-gray-800">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Đăng Nhập
        </CardTitle>
        <CardDescription className="text-center">
          Nhập thông tin tài khoản của bạn để tiếp tục
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="Nhập username"
              required
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Mật khẩu</Label>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="******"
              required
              className="rounded-xl"
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-500 text-sm text-center font-medium border border-red-100">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Đang xử lý..." : "Đăng Nhập"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center flex-col gap-2">
        <div className="text-sm text-gray-500">
          Chưa có tài khoản?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-bold hover:underline"
          >
            Đăng ký ngay
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
