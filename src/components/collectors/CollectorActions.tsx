import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit2, Trash2, UserCheck, Ban, ChevronDown } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CollectorActionsProps {
  collector: {
    id: string;
    name: string;
    active?: boolean | null;
  };
  onEdit: (collector: { id: string; name: string }) => void;
  onUpdate: () => void;
}

export function CollectorActions({ collector, onEdit, onUpdate }: CollectorActionsProps) {
  const { toast } = useToast();

  const handleDeleteCollector = async () => {
    const { error } = await supabase
      .from('collectors')
      .delete()
      .eq('id', collector.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete collector",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Collector deleted",
        description: "The collector has been removed successfully.",
      });
      onUpdate();
    }
  };

  const handleActivateCollector = async () => {
    const { error } = await supabase
      .from('collectors')
      .update({ active: true })
      .eq('id', collector.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to activate collector",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Collector activated",
        description: "The collector has been activated successfully.",
      });
      onUpdate();
    }
  };

  const handleDeactivateCollector = async () => {
    const { error } = await supabase
      .from('collectors')
      .update({ active: false })
      .eq('id', collector.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to deactivate collector",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Collector deactivated",
        description: "The collector has been deactivated successfully.",
      });
      onUpdate();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="ml-4 shrink-0">
          Actions <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => onEdit(collector)} className="gap-2">
          <Edit2 className="h-4 w-4" /> Edit Name
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleActivateCollector} className="gap-2">
          <UserCheck className="h-4 w-4" /> Activate
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDeactivateCollector} className="gap-2">
          <Ban className="h-4 w-4" /> Deactivate
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDeleteCollector} className="gap-2 text-red-600">
          <Trash2 className="h-4 w-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}