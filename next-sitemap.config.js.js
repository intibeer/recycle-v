module.exports = {
  siteUrl: process.env.ROOT_DOMAIN || 'https://www.recycle.co.uk',
  generateRobotsTxt: true, // Generates robots.txt file
  sitemapSize: 7000, // Customize if you have more than 7000 pages
  outDir: './public', // Output to the public directory
};