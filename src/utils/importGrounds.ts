import { supabase } from "@/integrations/supabase/client";

// Function to parse CSV data and upload to Supabase
export const importCricketGroundsFromCSV = async (csvData: string) => {
  try {
    // Split the CSV into lines
    const lines = csvData.trim().split('\n');
    
    // Extract header row and column names
    const headers = lines[0].split(',');
    
    // Process data rows
    const grounds = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      const ground: Record<string, any> = {};
      
      // Map values to column names
      headers.forEach((header, index) => {
        // Convert boolean strings to actual booleans
        if (header === 'rounded_rect' || header === 'odi_only') {
          ground[header] = values[index] === '1' || values[index] === 'true';
        } 
        // Convert numeric strings to numbers
        else if (header === 'height' || header === 'width') {
          ground[header] = parseFloat(values[index]);
        } 
        // Keep everything else as strings
        else {
          ground[header] = values[index];
        }
      });
      
      grounds.push(ground);
    }
    
    // Upload to Supabase using the edge function
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/insert-cricket-grounds`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabase.auth.getSession().then(({ data }) => data.session?.access_token)}`
      },
      body: JSON.stringify({ grounds })
    });
    
    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error('Error importing cricket grounds:', error);
    return { success: false, error };
  }
};

// Alternative method using direct Supabase client (if edge function not needed)
export const importGroundsDirectly = async (grounds: any[]) => {
  try {
    const { data, error } = await supabase
      .from('cricket_grounds')
      .insert(grounds)
      .select();
      
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error importing grounds directly:', error);
    return { success: false, error };
  }
};
