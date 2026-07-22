import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { Input, Label, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Contact", description: "Get in touch with the JavaChip team." };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-semibold text-foreground">Contact us</h1>
      <p className="mt-4 text-foreground-muted">
        Questions, feedback, or a bug to report? Send us a note — this form is a UI scaffold; wire
        it to your support inbox or ticketing system of choice before launch.
      </p>
      <Card className="mt-8 p-6">
        <form className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" name="message" required />
          </div>
          <Button type="submit">Send message</Button>
        </form>
      </Card>
    </div>
  );
}
