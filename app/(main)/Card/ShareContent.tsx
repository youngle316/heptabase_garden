import { useToast } from "@/hooks/use-toast";
import { Share2 } from "lucide-react";

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
    <div
      onClick={handleShare}
      className="cursor-pointer transition-opacity hover:opacity-80"
    >
      <Share2 size={16} />
    </div>
  );
}
