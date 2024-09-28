'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox" // Import for Checkbox component

type UsedItem = {
  post_id: string
  name: string
  description: string
  image_url: string
  price: string
  location: string
  created_at: string
}

type LocationSuggestion = {
  display_name: string;
  lat: string;
  lon: string;
};


export default function Dashboard() {
  const [items, setItems] = useState<UsedItem[]>([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState<number | ''>('') // Updated to be a number or empty string
  const [location, setLocation] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [termsAgreed, setTermsAgreed] = useState(false) // State for terms checkbox
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]); // Store location suggestions

  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
        fetchItems(user.id)
      } else {
        router.push('/login')
      }
    }
    fetchUser()
  }, [supabase, router])

  const fetchItems = async (userId: string) => {
    const { data, error } = await supabase
      .from('used-objects')
      .select('*')
      .eq('site', `recycle.co.uk${userId}`)
      .order('created_at', { ascending: false })

    if (error) {
      setMessage({ type: 'error', text: 'Failed to fetch items' })
    } else {
      setItems(data)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    if (!userId) {
      setMessage({ type: 'error', text: 'User not authenticated' })
      setLoading(false)
      return
    }

    if (!termsAgreed) {
      setMessage({ type: 'error', text: 'You must agree to the terms and conditions' })
      setLoading(false)
      return
    }

    let image_url = ''
    if (image) {
      const fileExt = image.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const { error: uploadError } = await supabase.storage
        .from('item-images')
        .upload(fileName, image)

      if (uploadError) {
        setMessage({ type: 'error', text: 'Failed to upload image' })
        setLoading(false)
        return
      }

      const { data: { publicUrl } } = supabase.storage
        .from('item-images')
        .getPublicUrl(fileName)

      image_url = publicUrl
    }

    const { error } = await supabase.from('used-objects').insert({
      post_id: Math.random().toString(36).substr(2, 9),
      name,
      description,
      image_url,
      price: price.toString(), 
      location,
      site: `recycle.co.uk${userId}`,
      date: new Date().toISOString(),
    })

    if (error) {
      setMessage({ type: 'error', text: 'Failed to add item' })
    } else {
      setMessage({ type: 'success', text: 'Item added successfully' })
      setName('')
      setDescription('')
      setPrice('')
      setLocation('')
      setImage(null)
      setTermsAgreed(false) // Reset terms checkbox
      fetchItems(userId)
    }

    setLoading(false)
  }

  const handleLocationSearch = async (query: string) => {
    try {
      if (query.length < 3) return;
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&addressdetails=1&limit=5`);
      const data = await response.json();
      setLocationSuggestions(data);
    } catch (error) {
      console.error('Error fetching location:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Add New Item</CardTitle>
            <CardDescription>Fill in the details to add a new used item</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Item Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Item Description</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Item Price (GBP)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Your Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value)
                    handleLocationSearch(e.target.value) // Trigger location search
                  }}
                  placeholder="Enter location"
                  required
                  list="location-options"
                />
                <datalist id="location-options">
                  {locationSuggestions.map((suggestion, index) => (
                    <option key={index} value={suggestion.display_name} />
                  ))}
                </datalist>
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Item Image</Label>
                <Input
                  id="image"
                  type="file"
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
                  accept="image/*"
                />
              </div>
              <div className="space-y-2">
                <Checkbox
                  id="terms"
                  checked={termsAgreed}
                  onCheckedChange={() => setTermsAgreed(!termsAgreed)}
                />
                <Label htmlFor="terms" className='ml-2'>
                  I agree to the <a href="/terms-of-use" className="underline text-blue-500">terms and conditions</a>
                </Label>
              </div>
              <Button type="submit" disabled={loading} className='text-white font-extrabold tracking-tighter'>
                {loading ? 'Adding...' : 'Add Item'}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            {message && (
              <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
                <AlertTitle>{message.type === 'error' ? 'Error' : 'Success'}</AlertTitle>
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Your Listed Items</CardTitle>
            <CardDescription>List of your posted items</CardDescription>
          </CardHeader>
          <CardContent>
            {items.map(item => (<p key={item.post_id}>{item.name}</p>))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
