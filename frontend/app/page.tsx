'use client';

import Link from 'next/link';
import {
  ShoppingCart,
  Headphones,
  DiscAlbumIcon as Vinyl,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
export default function Home() {
  return (
    <main>
      <Header />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 to-black text-white py-20">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Discover Your Sound in Vinyl
            </h1>
            <p className="text-lg text-blue-100">
              Premium vinyl records, rare collections, and exclusive releases
              for true music enthusiasts.
            </p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <Button
                asChild
                size="lg"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Link href="#shop">Shop Now</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white text-black hover:bg-white/10"
              >
                <Link href="#new-releases">New Releases</Link>
              </Button>
            </div>
          </div>
          <div className="hidden md:block relative">
            <div className="absolute -top-10 -left-10 w-64 h-64 bg-blue-600 rounded-full opacity-20"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-400 rounded-full opacity-20"></div>
            <div className="relative z-10 bg-gradient-to-br from-blue-800 to-black p-6 rounded-lg shadow-xl">
              <Image
                src="/vinyls.png"
                alt="Vinyl Records Collection"
                className="w-full h-auto rounded"
                width={500}
                height={500}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white" id="features">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose SoundSphere
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-lg border border-gray-100 shadow-sm">
              <div className="bg-blue-100 p-3 rounded-full mb-4">
                <Vinyl className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600">
                Carefully selected vinyl records with exceptional audio quality
                and pristine condition.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg border border-gray-100 shadow-sm">
              <div className="bg-blue-100 p-3 rounded-full mb-4">
                <ShoppingCart className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Exclusive Releases</h3>
              <p className="text-gray-600">
                Access to limited editions, rare pressings, and SoundSphere
                exclusive collections.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg border border-gray-100 shadow-sm">
              <div className="bg-blue-100 p-3 rounded-full mb-4">
                <Headphones className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Curation</h3>
              <p className="text-gray-600">
                Personalized recommendations from our team of music enthusiasts
                and industry experts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Our Customers Say
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Alex Johnson',
                role: 'Vinyl Collector',
                quote:
                  'SoundSphere has transformed my vinyl collecting experience. Their curation is impeccable and the quality is always top-notch.',
              },
              {
                name: 'Sarah Williams',
                role: 'Music Producer',
                quote:
                  'As someone in the industry, I appreciate the attention to detail and the exclusive releases that SoundSphere offers. Simply unmatched.',
              },
              {
                name: 'Michael Chen',
                role: 'DJ & Enthusiast',
                quote:
                  "I've discovered so many gems through SoundSphere. Their recommendations are always spot on and have expanded my collection in ways I never expected.",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-50 p-6 rounded-lg border border-gray-100"
              >
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-bold">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">
                  &quot;{testimonial.quote}&quot;
                </p>
                <div className="mt-4 flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-current text-yellow-400"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Vinyl Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join SoundSphere today and get access to exclusive releases,
            member-only discounts, and personalized recommendations.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white text-blue-600 hover:bg-blue-50"
          >
            <Link href="/sign-up">Create Your Account</Link>
          </Button>
        </div>
      </section>
      <Footer />
    </main>
  );
}
