import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Product } from '@/types/productTypes';
import { Review } from '@/types/reviewTypes';
import { Textarea } from '@/components/ui/textarea';
import { createReview } from '@/services/productsService';
import { useState } from 'react';

export function ReviewDialog({
  product,
  isReviewed,
  userReview,
  onSubmit,
}: {
  product: Product;
  isReviewed: boolean;
  userReview?: Review;
  onSubmit: (rating: number, review: string) => void;
}) {
  const [rating, setRating] = useState(userReview?.rating || 0);
  const [review, setReview] = useState(userReview?.comment || '');

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          {isReviewed ? 'Edit Review' : 'Write a Review'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isReviewed ? 'Edit Review' : 'Write a Review'}
          </DialogTitle>
          <DialogDescription>
            {isReviewed
              ? `Edit your review for ${product.name}`
              : `Write a review for ${product.name}`}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Rating
            </Label>
            <Input
              id="rating"
              type="number"
              max={5}
              min={1}
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Review
            </Label>
            <Textarea
              id="review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                onSubmit(rating, review);
              }}
            >
              {isReviewed ? 'Update Review' : 'Submit Review'}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
