"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, Loader2, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { AuthSignUp } from "@/components/ui/auth-form-1";

export default function SignUpPage() {
  return (
    <div className="w-full flex justify-center items-center min-h-screen p-4">
      <div
        data-slot="auth"
        className={cn("mx-auto w-full max-w-md")}
      >
        <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card/80 shadow-xl backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
          <div className="relative z-10">
            <AuthSignUp onSignIn={() => window.location.href = '/login'} />
          </div>
        </div>
      </div>
    </div>
  );
}