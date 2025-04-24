"use client"

import { getReviews } from "@/lib/data"
import PostForm from "@/components/post-form"
import { updateReview } from "@/app/actions"
import { notFound } from "next/navigation"

interface EditReviewPageProps {
  params: {
    id: string
  }
}

export default function EditReviewPage({ params }: EditReviewPageProps) {
  const reviews = getReviews()
  const review = reviews.find((r) => r.id === params.id)

  if (!review) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Editar Review</h1>
      <PostForm type="review" initialData={review} onSubmit={updateReview} />
    </div>
  )
}
