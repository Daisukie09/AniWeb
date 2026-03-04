import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import Button from "./common/custom-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import GoogleIcon from "@/icons/google";
import FacebookIcon from "@/icons/facebook";
import { pb } from "@/lib/pocketbase";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth-store";

type FormData = {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
};

function LoginPopoverButton() {
  const auth = useAuthStore();
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [tabValue, setTabValue] = useState<"login" | "signup">("login");

  const loginWithEmail = async () => {
    try {
      if (formData.username === "" || formData.password === "") {
        toast.error("Please fill in all fields", {
          style: { background: "red" },
        });
        return;
      }

      await pb
        .collection("users")
        .authWithPassword(formData.username, formData.password);

      if (pb.authStore.isValid && pb.authStore.record) {
        toast.success("Login successful", { style: { background: "green" } });
        clearForm();
        auth.setAuth({
          id: pb.authStore.record.id,
          email: pb.authStore.record.email,
          username: pb.authStore.record.username,
          avatar: pb.authStore.record.avatar,
          collectionId: pb.authStore.record.collectionId,
          collectionName: pb.authStore.record.collectionName,
          autoSkip: pb.authStore.record.autoSkip,
        });
      }
    } catch (e: any) {
      console.error("Login error:", e);
      const errorMessage = e?.message || "Invalid username or password";
      toast.error(errorMessage, {
        style: { background: "red" },
      });
    }
  };

  const signupWithEmail = async () => {
    // Validate all fields are filled
    if (
      formData.username === "" ||
      formData.password === "" ||
      formData.email === "" ||
      formData.confirm_password === ""
    ) {
      toast.error("Please fill in all fields", {
        style: { background: "red" },
      });
      return;
    }

    // Validate password and confirm password match
    if (formData.password !== formData.confirm_password) {
      toast.error("Passwords do not match", {
        style: { background: "red" },
      });
      return;
    }

    // Validate password length (PocketBase default minimum is 8 characters)
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long", {
        style: { background: "red" },
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address", {
        style: { background: "red" },
      });
      return;
    }

    try {
      const user = await pb.collection("users").create({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        passwordConfirm: formData.confirm_password,
        emailVisibility: true,
      });

      if (user) {
        toast.success("Account created successfully! Please login.", {
          style: { background: "green" },
        });
        clearForm();
        setTabValue("login");
      }
    } catch (e: any) {
      console.error("Signup error:", e);
      
      // Handle PocketBase specific error responses
      if (e?.response?.data) {
        const errorData = e.response.data;
        let errorMessages: string[] = [];
        
        for (const key in errorData) {
          if (errorData[key]?.message) {
            errorMessages.push(`${key}: ${errorData[key].message}`);
          }
        }
        
        if (errorMessages.length > 0) {
          errorMessages.forEach((msg) => {
            toast.error(msg, {
              style: { background: "red" },
            });
          });
        } else {
          toast.error("Signup failed. Please check your information and try again.", {
            style: { background: "red" },
          });
        }
      } else if (e?.message) {
        toast.error(e.message, {
          style: { background: "red" },
        });
      } else {
        toast.error("Signup failed. Please try again.", {
          style: { background: "red" },
        });
      }
    }
  };

  const clearForm = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      confirm_password: "",
    });
  };

  const loginWithGoogle = async () => {
    try {
      const res = await pb.collection("users").authWithOAuth2({
        provider: "google",
      });

      if (pb.authStore.isValid && pb.authStore.record) {
        await pb.collection("users").update(pb.authStore.record?.id!, {
          username: res.meta?.username || res.meta?.name,
        });

        toast.success("Login successful", { style: { background: "green" } });
        auth.setAuth({
          id: pb.authStore.record.id,
          email: pb.authStore.record.email,
          username: pb.authStore.record.username,
          avatar: pb.authStore.record.avatar,
          collectionId: pb.authStore.record.collectionId,
          collectionName: pb.authStore.record.collectionName,
          autoSkip: pb.authStore.record.autoSkip,
        });
      }
    } catch (e: any) {
      console.error("Google login error:", e);
      toast.error("Google login failed. Please try again.", {
        style: { background: "red" },
      });
    }
  };

  const loginWithFacebook = async () => {
    try {
      const res = await pb.collection("users").authWithOAuth2({
        provider: "facebook",
      });

      if (pb.authStore.isValid && pb.authStore.record) {
        await pb.collection("users").update(pb.authStore.record?.id!, {
          username: res.meta?.username || res.meta?.name,
        });

        toast.success("Login successful", { style: { background: "green" } });
        auth.setAuth({
          id: pb.authStore.record.id,
          email: pb.authStore.record.email,
          username: pb.authStore.record.username,
          avatar: pb.authStore.record.avatar,
          collectionId: pb.authStore.record.collectionId,
          collectionName: pb.authStore.record.collectionName,
          autoSkip: pb.authStore.record.autoSkip,
        });
      }
    } catch (e: any) {
      console.error("Facebook login error:", e);
      toast.error("Facebook login failed. Please try again.", {
        style: { background: "red" },
      });
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="bg-white text-md text-black hover:bg-gray-200 hover:text-black transition-all duration-300"
        >
          Login
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        className="bg-black bg-opacity-50 backdrop-blur-sm w-[300px] mt-4 mr-4 p-4"
      >
        <Tabs
          defaultValue={tabValue}
          value={tabValue}
          onValueChange={(value) => setTabValue(value as "login" | "signup")}
        >
          <TabsList>
            <TabsTrigger onClick={clearForm} value="login">
              Login
            </TabsTrigger>
            <TabsTrigger onClick={clearForm} value="signup">
              Signup
            </TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="flex flex-col gap-2">
            <div className="mt-2">
              <p className="text-gray-300 text-xs">Email or Username:</p>
              <Input
                required
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                type="text"
                value={formData.username}
                placeholder="Enter your email/username"
              />
            </div>
            <div>
              <p className="text-gray-300 text-xs">Password:</p>
              <Input
                required
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Enter your password"
              />
            </div>
            <Button
              variant="default"
              className="w-full text-xs"
              size="sm"
              type="submit"
              onClick={loginWithEmail}
            >
              Login
            </Button>
            <div className="relative my-2">
              <hr className="border-gray-600" />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/50 px-2 text-xs text-gray-400">
                or
              </span>
            </div>
            <Button
              variant="default"
              className="bg-white hover:bg-gray-200 text-gray-800 w-full text-xs"
              size="sm"
              onClick={loginWithGoogle}
            >
              <GoogleIcon className="mr-2" />
              Login with Google
            </Button>
            <Button
              variant="default"
              className="bg-[#1877F2] hover:bg-[#166fe5] text-white w-full text-xs"
              size="sm"
              onClick={loginWithFacebook}
            >
              <FacebookIcon className="mr-2" />
              Login with Facebook
            </Button>
          </TabsContent>
          <TabsContent value="signup" className="flex flex-col gap-2">
            <div>
              <p className="text-gray-300 text-xs">Username:</p>
              <Input
                required
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                type="text"
                value={formData.username}
                placeholder="Enter your username"
              />
            </div>
            <div>
              <p className="text-gray-300 text-xs">Email:</p>
              <Input
                required
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                type="email"
                value={formData.email}
                placeholder="Enter your email"
              />
            </div>
            <div>
              <p className="text-gray-300 text-xs">Password:</p>
              <Input
                required
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                type="password"
                value={formData.password}
                placeholder="Min 8 characters"
              />
            </div>
            <div>
              <p className="text-gray-300 text-xs">Confirm Password:</p>
              <Input
                required
                onChange={(e) =>
                  setFormData({ ...formData, confirm_password: e.target.value })
                }
                type="password"
                value={formData.confirm_password}
                placeholder="Enter your password again"
              />
            </div>
            <Button
              variant="default"
              className="w-full text-xs"
              size="sm"
              type="submit"
              onClick={signupWithEmail}
            >
              Signup
            </Button>
            <div className="relative my-2">
              <hr className="border-gray-600" />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/50 px-2 text-xs text-gray-400">
                or
              </span>
            </div>
            <Button
              variant="default"
              className="bg-white hover:bg-gray-200 text-gray-800 w-full text-xs"
              size="sm"
              onClick={loginWithGoogle}
            >
              <GoogleIcon className="mr-2" />
              Signup with Google
            </Button>
            <Button
              variant="default"
              className="bg-[#1877F2] hover:bg-[#166fe5] text-white w-full text-xs"
              size="sm"
              onClick={loginWithFacebook}
            >
              <FacebookIcon className="mr-2" />
              Signup with Facebook
            </Button>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}

export default LoginPopoverButton;
