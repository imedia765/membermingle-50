import Papa from 'papaparse';
import { transformMemberForSupabase, transformCollectorForSupabase } from './dataCleanup';

export async function importMembersFromCsv(file: string) {
  try {
    const response = await fetch(file);
    const csvText = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          console.log('Parsed CSV data:', results.data);
          resolve(results.data);
        },
        error: (error) => {
          console.error('CSV parsing error:', error);
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error('Error fetching CSV:', error);
    throw error;
  }
}