import type { Metadata } from 'next'


// Define the categories and their corresponding URLs
const categories = [
  {'href': '/home-garden', 'category': 'Home & Garden'},
  {'href': '/baby-kids-stuff', 'category': 'Baby & Kids Stuff'},
  {'href': '/clothing', 'category': 'Clothes, Footwear & Accessories'},
  {'href': '/sports-leisure-travel', 'category': 'Sports, Leisure & Travel'},
  {'href': '/miscellaneous-goods', 'category': 'Random Goods'},
  {'href': '/diy-tools-materials', 'category': 'DIY Tools & Materials'},
  {'href': '/kitchen-appliances', 'category': 'Appliances'},
  {'href': '/cds-dvds-games-books', 'category': 'Music, Films, Books & Games'},
  {'href': '/computers-software', 'category': 'Computers & Software'},
  {'href': '/phones', 'category': 'Phones, Mobile Phones & Telecoms'},
  {'href': '/office-furniture-equipment', 'category': 'Office Furniture & Equipment'},
  {'href': '/health-beauty', 'category': 'Health & Beauty'},
  {'href': '/music-instruments', 'category': 'Musical Instruments & DJ Equipment'},
  {'href': '/tv-dvd-cameras', 'category': 'TV, DVD, Blu-Ray & Videos'},
  {'href': '/stereos-audio', 'category': 'Audio & Stereo'},
  {'href': '/video-games-consoles', 'category': 'Video Games & Consoles'},
  {'href': '/cameras-studio-equipment', 'category': 'Cameras, Camcorders & Studio Equipment'},
  {'href': '/house-clearance', 'category': 'House Clearance'},
  {'href': '/christmas-decorations', 'category': 'Christmas Decorations'},
]

export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const category = categories.find((cat) => cat.href === `/${params.category}`)
  
  if (!category) {
    return {
      title: 'Category Not Found',
      description: 'The requested category does not exist.',
    }
  }

  return {
    title: `Used ${category.category} Items | Find Second-Hand Bargains`,
    description: `Discover a wide range of used ${category.category.toLowerCase()} items. Find great deals on second-hand ${category.category.toLowerCase()} and save money today!`,
    keywords: [`used ${category.category.toLowerCase()}`, 'second-hand', 'pre-owned', 'bargains', 'deals'],
    openGraph: {
      title: `Used ${category.category} Items | Find Second-Hand Bargains`,
      description: `Discover a wide range of used ${category.category.toLowerCase()} items. Find great deals on second-hand ${category.category.toLowerCase()} and save money today!`,
      type: 'website',
      url: `https://recycle.co.uk${category.href}`,
      images: [
        {
          url: `https://recycle.co.uk/og-images/${params.category}.jpg`,
          width: 1200,
          height: 630,
          alt: `Used ${category.category} Items`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Used ${category.category} Items | Find Second-Hand Bargains`,
      description: `Discover a wide range of used ${category.category.toLowerCase()} items. Find great deals on second-hand ${category.category.toLowerCase()} and save money today!`,
      images: [`https://recycle.co.uk/og-images/${params.category}.jpg`],
    },
  }
}

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
        <main className="min-h-screen">
          {children}
        </main>

  )
}