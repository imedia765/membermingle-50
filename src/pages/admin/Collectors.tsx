import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, UserPlus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { importDataFromJson } from "@/utils/importData";
import { EditCollectorDialog } from "@/components/collectors/EditCollectorDialog";
import { CollectorList } from "@/components/collectors/CollectorList";

export default function Collectors() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCollector, setExpandedCollector] = useState<string | null>(null);
  const [editingCollector, setEditingCollector] = useState<{ id: string; name: string } | null>(null);
  const { toast } = useToast();

  const { data: collectors, isLoading, refetch } = useQuery({
    queryKey: ['collectors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('collectors')
        .select(`
          *,
          members:members(*)
        `);
      
      if (error) throw error;
      return data;
    }
  });

  const toggleCollector = (collectorId: string) => {
    setExpandedCollector(expandedCollector === collectorId ? null : collectorId);
  };

  const handleImportData = async () => {
    const result = await importDataFromJson();
    if (result.success) {
      toast({
        title: "Data imported successfully",
        description: "The collectors and members data has been imported.",
      });
    } else {
      toast({
        title: "Import failed",
        description: "There was an error importing the data.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <h1 className="text-4xl font-bold text-white">
          Collectors Management
        </h1>
        <div className="flex flex-wrap gap-2">
          <Button 
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => handleImportData()}
          >
            <UserPlus className="h-4 w-4" />
            Import Data
          </Button>
          <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
            <UserPlus className="h-4 w-4" />
            Add New Collector
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by collector name or number..." 
            className="pl-8" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <CollectorList
        collectors={collectors || []}
        expandedCollector={expandedCollector}
        onToggleCollector={toggleCollector}
        onEditCollector={setEditingCollector}
        onUpdate={refetch}
        isLoading={isLoading}
        searchTerm={searchTerm}
      />

      {editingCollector && (
        <EditCollectorDialog
          isOpen={true}
          onClose={() => setEditingCollector(null)}
          collector={editingCollector}
          onUpdate={refetch}
        />
      )}
    </div>
  );
}