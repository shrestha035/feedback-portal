import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Send, Loader2, Mail, User, FileText, MessageSquare } from "lucide-react";

const contactSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }).max(100, { message: "Name must be less than 100 characters" }),
  email: z.string().trim().email({ message: "Invalid email address" }).max(255, { message: "Email must be less than 255 characters" }),
  subject: z.string().trim().min(1, { message: "Subject is required" }).max(200, { message: "Subject must be less than 200 characters" }),
  message: z.string().trim().min(10, { message: "Message must be at least 10 characters" }).max(1000, { message: "Message must be less than 1000 characters" }),
});

type ContactFormData = z.infer<typeof contactSchema>;

export const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    try {
      const payload = {
        ...data,
        status: "new",
      };

      const res = await fetch(
        "https://hdzpioilnzktlnilgolg.supabase.co/rest/v1/contact_feedback",
        {
          method: "POST",
          headers: {
            apikey:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhkenBpb2lsbnprdGxuaWxnb2xnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyNTI1NTMsImV4cCI6MjA3OTgyODU1M30.yHylDl26eHdpeFo85dyfXfiAbkIw4Bio_tJdQERb1B8",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhkenBpb2lsbnprdGxuaWxnb2xnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyNTI1NTMsImV4cCI6MjA3OTgyODU1M30.yHylDl26eHdpeFo85dyfXfiAbkIw4Bio_tJdQERb1B8",
            "Content-Type": "application/json",
            Prefer: "return=representation",
          },
          body: JSON.stringify(payload),
        }
      );

      if (res.ok) {
        toast({
          title: "Message sent successfully! 🎉",
          description: "We'll get back to you as soon as possible.",
        });
        reset();
      } else {
        const error = await res.text();
        console.error("Error:", error);
        toast({
          variant: "destructive",
          title: "Submission failed",
          description: "Please try again later or contact us directly.",
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Network error",
        description: "Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto glass-effect animate-glow border-primary/20">
      <CardHeader className="text-center space-y-2 pb-8">
        <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-2 animate-float">
          <Mail className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Get in Touch
        </CardTitle>
        <CardDescription className="text-base">
          We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              Name
            </Label>
            <Input
              id="name"
              placeholder="John Doe"
              {...register("name")}
              className="transition-all duration-300 focus:shadow-md focus:shadow-primary/20"
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              {...register("email")}
              className="transition-all duration-300 focus:shadow-md focus:shadow-primary/20"
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject" className="text-sm font-medium flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              Subject
            </Label>
            <Input
              id="subject"
              placeholder="How can we help you?"
              {...register("subject")}
              className="transition-all duration-300 focus:shadow-md focus:shadow-primary/20"
              disabled={isSubmitting}
            />
            {errors.subject && (
              <p className="text-sm text-destructive">{errors.subject.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-medium flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" />
              Message
            </Label>
            <Textarea
              id="message"
              placeholder="Tell us more about your inquiry..."
              rows={6}
              {...register("message")}
              className="transition-all duration-300 focus:shadow-md focus:shadow-primary/20 resize-none"
              disabled={isSubmitting}
            />
            {errors.message && (
              <p className="text-sm text-destructive">{errors.message.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-300 text-white font-semibold py-6 text-lg shadow-lg hover:shadow-xl hover:shadow-primary/30"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" />
                Send Message
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
