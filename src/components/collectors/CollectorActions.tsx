import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit2, Trash2, UserCheck, Ban, ChevronDown, UserMinus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

interface CollectorActionsProps {
  collector: {
    id: string;
    name: string;
    active?: boolean | null;
  };
  collectors: Array<{ id: string; name: string }>;
  onEdit: (collector: { id: string; name: string }) => void;
  onUpdate: () => void;
}

export function CollectorActions({ collector, collectors, onEdit, onUpdate }: CollectorActionsProps) {
  const { toast } = useToast();
  const [showMoveDialog, setShowMoveDialog] = useState(false);
  const [selectedCollectorId, setSelectedCollectorId] = useState<string>("");

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

  const handleMoveMembers = async () => {
    if (!selectedCollectorId) {
      toast({
        title: "Error",
        description: "Please select a collector",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from('members')
      .update({ collector_id: selectedCollectorId })
      .eq('collector_id', collector.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to move members",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Members moved",
        description: "All members have been moved to the selected collector.",
      });
      setShowMoveDialog(false);
      onUpdate();
    }
  };

  return (
    <>
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
          <DropdownMenuItem onClick={() => setShowMoveDialog(true)} className="gap-2">
            <UserMinus className="h-4 w-4" /> Move Members
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleActivateCollector} className="gap-2">
            <UserCheck className="h-4 w-4" /> Activate
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDeactivateCollector} className="gap-2">
            <Ban className="h-4 w-4" /> Deactivate
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDeleteCollector} className="gap-2 text-red-600">
            <Trash2 className="h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showMoveDialog} onOpenChange={setShowMoveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Move Members to Another Collector</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Select onValueChange={setSelectedCollectorId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a collector" />
              </SelectTrigger>
              <SelectContent>
                {collectors
                  .filter(c => c.id !== collector.id)
                  .map(c => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMoveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleMoveMembers}>
              Move Members
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}