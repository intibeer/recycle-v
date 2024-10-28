"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ResultItem as ResultItemType } from "@/hooks/used-object-search";

export default function ProductPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [item, setItem] = useState<ResultItemType | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await fetch(`/api/items/${id}`);
        const data = await response.json();
        setItem(data);
      } catch (error) {
        console.error("Error fetching item:", error);
        router.push("/404");
      }
    };
    fetchItem();
  }, [id, router]);

  if (!item) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold">{item.name}</h1>
      <img src={item.image_url} alt={item.name} className="w-full h-48 object-cover mb-4" />
      <p>{item.description}</p>
      <p className="font-bold text-lg">Price: £{item.price}</p>
    </div>
  );
}
