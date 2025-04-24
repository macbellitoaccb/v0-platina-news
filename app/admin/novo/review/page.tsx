"use client"

import PostForm from "@/components/post-form"
import { createReview } from "@/app/actions"

export default function NovaReviewPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Nova Review</h1>
      <PostForm type="review" onSubmit={createReview} />
    </div>
  )
}
