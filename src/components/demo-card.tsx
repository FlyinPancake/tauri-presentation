import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DemoCardProps {
  number: number;
  title: string;
  description: string;
  children: React.ReactNode;
}

export function DemoCard({
  number,
  title,
  description,
  children,
}: DemoCardProps) {
  return (
    <Card className="border-border/50 shadow-sm hover:shadow-md transition-all duration-200 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Badge
            variant="secondary"
            className="text-xs px-2 py-0.5 font-semibold"
          >
            {number}
          </Badge>
          {title}
        </CardTitle>
        <CardDescription className="text-xs">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">{children}</CardContent>
    </Card>
  );
}
