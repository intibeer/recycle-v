import { supabase } from "./supabase-client";

/**
 * Function to fetch unique towns from the used-objects table.
 * @returns {Promise<string[]>} - A promise that resolves to an array of unique town names.
 */
export async function fetchUniqueTowns(): Promise<string[]> {
  try {
    // Using raw SQL to fetch distinct towns
    const { data, error } = await supabase
      .from("distinct_towns")
      .select("town");

    if (error) {
      console.log(error);
      throw new Error(`Error fetching towns: ${error.message}`);
    }
    return data.map((item) => item.town);
  } catch (error) {
    console.error(error);
    return []; // Return an empty array in case of error
  }
}
