import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, UserPlus, ChevronDown, ChevronRight, Edit2, Trash2, UserCheck, Ban } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { importDataFromJson } from "@/utils/importData";

export default function Collectors() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCollector, setExpandedCollector] = useState<string | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Fetch collectors data
  const { data: collectors, isLoading } = useQuery({
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

  const handleDeleteCollector = async (collectorId: string) => {
    const { error } = await supabase
      .from('collectors')
      .delete()
      .eq('id', collectorId);

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
    }
  };

  const handleActivateCollector = async (collectorId: string) => {
    const { error } = await supabase
      .from('collectors')
      .update({ active: true })
      .eq('id', collectorId);

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
    }
  };

  const handleDeactivateCollector = async (collectorId: string) => {
    const { error } = await supabase
      .from('collectors')
      .update({ active: false })
      .eq('id', collectorId);

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
    }
  };

  const filteredCollectors = collectors?.filter(collector =>
    collector.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collector.number.includes(searchTerm)
  ) ?? [];

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

      <ScrollArea className="h-[calc(100vh-220px)]">
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-4">Loading collectors...</div>
          ) : filteredCollectors.map((collector) => (
            <Card key={collector.id}>
              <CardHeader className="py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 min-w-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleCollector(collector.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white shrink-0"
                      title={expandedCollector === collector.id ? "Collapse" : "Expand"}
                    >
                      {expandedCollector === collector.id ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                    <div className="min-w-0">
                      <CardTitle className="text-xl text-white truncate">
                        {collector.prefix}{collector.number} - {collector.name}
                      </CardTitle>
                      <p className="text-sm text-white">
                        Members: {collector.members?.length || 0}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="ml-4 shrink-0">
                        Actions <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => handleActivateCollector(collector.id)} className="gap-2">
                        <UserCheck className="h-4 w-4" /> Activate
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeactivateCollector(collector.id)} className="gap-2">
                        <Ban className="h-4 w-4" /> Deactivate
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2">
                        <Edit2 className="h-4 w-4" /> Edit Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteCollector(collector.id)} className="gap-2 text-red-600">
                        <Trash2 className="h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              {expandedCollector === collector.id && collector.members && (
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-white">Name</TableHead>
                          <TableHead className="text-white">Member ID</TableHead>
                          <TableHead className="text-white">Email</TableHead>
                          <TableHead className="text-white">Contact Number</TableHead>
                          <TableHead className="text-white">Address</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {collector.members.map((member) => (
                          <TableRow key={member.id}>
                            <TableCell className="text-white">{member.full_name}</TableCell>
                            <TableCell className="text-white">{member.member_number}</TableCell>
                            <TableCell className="text-white">{member.email}</TableCell>
                            <TableCell className="text-white">{member.phone}</TableCell>
                            <TableCell className="text-white">{member.address}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}