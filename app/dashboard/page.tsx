'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type UsedItem = {
  post_id: string
  name: string
  description: string
  image_url: string
  price: string
  location: string
  created_at: string
}

export default function Dashboard() {
  const [items, setItems] = useState<UsedItem[]>([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [location, setLocation] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

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
      price,
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
      fetchItems(userId)
    }

    setLoading(false)
  }

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
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Image</Label>
                <Input
                  id="image"
                  type="file"
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
                  accept="image/*"
                />
              </div>
              <Button type="submit" disabled={loading}>
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
            <CardTitle>Your Items</CardTitle>
            <CardDescription>List of your posted items</CardDescription>
          </CardHeader>
          <CardContent>

          </CardContent>
        </Card>
      </div>
    </div>
  )
}