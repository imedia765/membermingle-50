import { supabase } from "@/integrations/supabase/client";
import { saveAs } from 'file-saver';

const TABLES = [
  'members',
  'collectors',
  'payments',
  'family_members',
  'registrations',
  'support_tickets',
  'ticket_responses',
  'admin_notes',
] as const;

type TableName = typeof TABLES[number];

interface BackupData {
  members: any[];
  collectors: any[];
  payments: any[];
  familyMembers: any[];
  registrations: any[];
  supportTickets: any[];
  ticketResponses: any[];
  adminNotes: any[];
  timestamp: string;
}

export async function exportDatabase() {
  try {
    const results = await Promise.all(
      TABLES.map(table => 
        supabase.from(table).select('*')
      )
    );

    const backupData: BackupData = {
      members: results[0].data || [],
      collectors: results[1].data || [],
      payments: results[2].data || [],
      familyMembers: results[3].data || [],
      registrations: results[4].data || [],
      supportTickets: results[5].data || [],
      ticketResponses: results[6].data || [],
      adminNotes: results[7].data || [],
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json'
    });

    saveAs(blob, `database_backup_${new Date().toISOString()}.json`);
    return { success: true };
  } catch (error) {
    console.error('Export error:', error);
    return { success: false, error };
  }
}

export async function restoreDatabase(backupFile: File) {
  try {
    const fileContent = await backupFile.text();
    const backupData = JSON.parse(fileContent) as BackupData;

    if (!backupData.timestamp || !backupData.members) {
      throw new Error('Invalid backup file format');
    }

    const tableMap: Record<keyof Omit<BackupData, 'timestamp'>, TableName> = {
      members: 'members',
      collectors: 'collectors',
      payments: 'payments',
      familyMembers: 'family_members',
      registrations: 'registrations',
      supportTickets: 'support_tickets',
      ticketResponses: 'ticket_responses',
      adminNotes: 'admin_notes'
    };

    for (const [key, tableName] of Object.entries(tableMap) as [keyof typeof tableMap, TableName][]) {
      const data = backupData[key];
      
      if (Array.isArray(data)) {
        const { error: deleteError } = await supabase
          .from(tableName)
          .delete()
          .neq('id', 'placeholder');

        if (deleteError) {
          console.error(`Error clearing ${tableName}:`, deleteError);
          throw deleteError;
        }

        if (data.length > 0) {
          const { error: insertError } = await supabase
            .from(tableName)
            .insert(data);

          if (insertError) {
            console.error(`Error restoring ${tableName}:`, insertError);
            throw insertError;
          }
        }
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Restore error:', error);
    return { success: false, error };
  }
}