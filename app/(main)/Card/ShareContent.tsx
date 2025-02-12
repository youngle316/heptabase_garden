import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Share } from "lucide-react";

export default function ShareContent({ cardId }: { cardId: string }) {
  const { toast } = useToast();

  const handleShare = async () => {
    const url = `${window.location.origin}/?cardId=${cardId}`;
    try {
      await navigator.clipboard.writeText(url);
      toast({
        description: "Link copied to clipboard",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Failed to copy",
        description: "Please copy the URL manually",
      });
    }
  };

  return (
    <Button onClick={handleShare}>
      <Share />
      Share
    </Button>
  );
}
