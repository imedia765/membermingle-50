import { supabase } from "@/integrations/supabase/client";
import { saveAs } from 'file-saver';

export async function exportDatabase() {
  try {
    // Fetch data from all tables
    const [
      membersResult,
      collectorsResult,
      paymentsResult,
      familyMembersResult,
      registrationsResult,
      supportTicketsResult,
      ticketResponsesResult,
      adminNotesResult
    ] = await Promise.all([
      supabase.from('members').select('*'),
      supabase.from('collectors').select('*'),
      supabase.from('payments').select('*'),
      supabase.from('family_members').select('*'),
      supabase.from('registrations').select('*'),
      supabase.from('support_tickets').select('*'),
      supabase.from('ticket_responses').select('*'),
      supabase.from('admin_notes').select('*')
    ]);

    const backupData = {
      members: membersResult.data,
      collectors: collectorsResult.data,
      payments: paymentsResult.data,
      familyMembers: familyMembersResult.data,
      registrations: registrationsResult.data,
      supportTickets: supportTicketsResult.data,
      ticketResponses: ticketResponsesResult.data,
      adminNotes: adminNotesResult.data,
      timestamp: new Date().toISOString()
    };

    // Create and download backup file
    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json'
    });
    
    saveAs(blob, `database_backup_${new Date().toISOString()}.json`);
    return { success: true };
  } catch (error) {
    console.error('Error creating backup:', error);
    throw error;
  }
}

export async function restoreDatabase(backupFile: File) {
  try {
    const fileContent = await backupFile.text();
    const backupData = JSON.parse(fileContent);

    // Validate backup data structure
    if (!backupData.timestamp || !backupData.members) {
      throw new Error('Invalid backup file format');
    }

    // Clear existing data and restore from backup
    for (const [table, data] of Object.entries(backupData)) {
      if (table === 'timestamp') continue;
      
      if (Array.isArray(data)) {
        // Delete existing records
        const { error: deleteError } = await supabase
          .from(table.toLowerCase())
          .delete()
          .neq('id', 'placeholder'); // Delete all records

        if (deleteError) {
          console.error(`Error clearing ${table}:`, deleteError);
          throw deleteError;
        }

        // Insert backup data
        if (data.length > 0) {
          const { error: insertError } = await supabase
            .from(table.toLowerCase())
            .insert(data);

          if (insertError) {
            console.error(`Error restoring ${table}:`, insertError);
            throw insertError;
          }
        }
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error restoring backup:', error);
    throw error;
  }
}