import { notFound } from 'next/navigation'
import UsedObjectSearch from '@/hooks/used-object-search'

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

export function generateStaticParams() {
  return categories.map((cat) => ({
    category: cat.href.slice(1), // Remove the leading slash
  }))
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const category = categories.find((cat) => cat.href === `/${params.category}`)

  if (!category) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8 ">
      <h1 className="mx-auto text-center text-3xl font-bold mb-6">Find Used {category.category}</h1>
      <UsedObjectSearch initialCategory={category.category} />
    </div>
  )
}