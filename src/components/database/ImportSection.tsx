import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { transformMemberForSupabase, transformCollectorForSupabase } from "@/utils/dataCleanup";
import { supabase } from "@/integrations/supabase/client";
import { ImportStatus } from "./ImportStatus";
import { importMembersFromCsv } from "@/utils/csvImport";

interface CsvData {
  collector: string;
  [key: string]: any;
}

export function ImportSection() {
  const { toast } = useToast();
  const [isImporting, setIsImporting] = useState(false);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const processCollectors = async (validData: CsvData[]) => {
    const uniqueCollectors = [...new Set(validData.map(item => item.collector).filter(Boolean))];
    console.log('Processing collectors:', uniqueCollectors);
    
    const collectorIdMap = new Map<string, string>();

    for (const collectorName of uniqueCollectors) {
      try {
        const { data: existingCollectors, error: searchError } = await supabase
          .from('collectors')
          .select('id')
          .eq('name', collectorName);

        if (searchError) {
          console.error('Error searching for collector:', searchError);
          continue;
        }

        let collectorId: string;

        if (!existingCollectors || existingCollectors.length === 0) {
          const collectorData = await transformCollectorForSupabase(collectorName);
          const { data: newCollector, error: insertError } = await supabase
            .from('collectors')
            .insert(collectorData)
            .select('id')
            .single();

          if (insertError) {
            console.error('Error inserting collector:', insertError);
            continue;
          }

          collectorId = newCollector.id;
        } else {
          collectorId = existingCollectors[0].id;
        }

        collectorIdMap.set(collectorName, collectorId);
      } catch (error) {
        console.error(`Error processing collector ${collectorName}:`, error);
      }
    }

    return collectorIdMap;
  };

  const processMembers = async (validData: CsvData[], collectorIdMap: Map<string, string>) => {
    for (const member of validData) {
      try {
        if (!member.collector) continue;

        const collectorId = collectorIdMap.get(member.collector);
        if (!collectorId) {
          console.error(`No collector ID found for ${member.collector}`);
          continue;
        }

        const memberData = transformMemberForSupabase(member);
        const { error: memberError } = await supabase
          .from('members')
          .insert({
            ...memberData,
            collector_id: collectorId,
            collector: member.collector,
          });

        if (memberError) {
          console.error('Error inserting member:', memberError);
        }
      } catch (error) {
        console.error('Error processing member:', error);
      }
    }
  };

  const importData = async () => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please log in to import data",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);
    try {
      const result = await importMembersFromCsv('/processed_members.csv');
      
      // Type check and cast the result
      if (!Array.isArray(result)) {
        throw new Error('Invalid CSV data format');
      }
      
      const data = result as CsvData[];
      console.log('CSV data loaded:', data);

      const collectorIdMap = await processCollectors(data);
      await processMembers(data, collectorIdMap);

      toast({
        title: "Import successful",
        description: "Members have been imported into the database",
      });
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Import failed",
        description: error instanceof Error ? error.message : "An error occurred during import",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import Data</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ImportStatus isAuthenticated={!!session} />
        <p className="text-sm text-muted-foreground">
          Import member data from processed_members.csv file into the database.
          This will create new records and update existing ones.
        </p>
        <Button 
          onClick={importData} 
          disabled={isImporting || !session}
          className="w-full flex items-center gap-2"
        >
          <FileSpreadsheet className="h-4 w-4" />
          {isImporting ? "Importing..." : "Import Members"}
        </Button>
      </CardContent>
    </Card>
  );
}