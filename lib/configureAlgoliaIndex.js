// config/algolia-setup.ts
export async function configureAlgoliaIndex() {
  try {
    await index.setSettings({
      // Define attributes that can be used as facets
      attributesForFaceting: [
        'category_hierarchy',
        'town',
        'site',
        'searchable(category_hierarchy)'  // Makes it searchable too
      ]
    });
    
    console.log('Successfully configured Algolia index');
    
    // Verify the settings
    const settings = await index.getSettings();
    console.log('Current settings:', settings);
  } catch (error) {
    console.error('Error configuring Algolia:', error);
  }
}

// Run this once
configureAlgoliaIndex();