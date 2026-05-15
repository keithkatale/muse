"use client"

import InteractiveBentoGallery from './interactive-bento-gallery'

// Art-themed media items for the gallery
const artMediaItems = [
  {
    id: 1,
    type: 'image',
    title: 'Abstract Expressions',
    desc: 'Bold colors and dynamic forms that capture emotion and movement',
    url: '/images/pick-2/abstract.png',
    span: 'col-span-2 row-span-3'
  },
  {
    id: 2,
    type: 'image',
    title: 'Minimalist Serenity',
    desc: 'Clean lines and subtle tones for modern spaces',
    url: '/images/pick-2/minimal.png',
    span: 'col-span-1 row-span-2'
  },
  {
    id: 3,
    type: 'image',
    title: 'Vintage Charm',
    desc: 'Nostalgic aesthetics with timeless appeal',
    url: '/images/pick-2/retro.png',
    span: 'col-span-1 row-span-2'
  },
  {
    id: 4,
    type: 'image',
    title: 'Photorealistic Art',
    desc: 'Stunning detail that blurs the line between art and photography',
    url: '/images/pick-2/realistic.png',
    span: 'col-span-2 row-span-2'
  },
  {
    id: 5,
    type: 'image',
    title: 'Illustrated Stories',
    desc: 'Whimsical narratives brought to life through artistic illustration',
    url: '/images/pick-2/illustrated.png',
    span: 'col-span-1 row-span-3'
  },
  {
    id: 6,
    type: 'image',
    title: 'Gallery Masterpiece',
    desc: 'Museum-quality artwork for discerning collectors',
    url: '/images/gallery/art-1.jpg',
    span: 'col-span-1 row-span-2'
  },
  {
    id: 7,
    type: 'image',
    title: 'Contemporary Vision',
    desc: 'Modern artistic expressions for today\'s aesthetic',
    url: '/images/gallery/art-3.jpg',
    span: 'col-span-2 row-span-2'
  },
  {
    id: 8,
    type: 'image',
    title: 'Artistic Harmony',
    desc: 'Balanced compositions that bring peace to any room',
    url: '/images/gallery/art-5.jpg',
    span: 'col-span-1 row-span-2'
  },
  {
    id: 9,
    type: 'image',
    title: 'Creative Expression',
    desc: 'Unique perspectives that inspire and captivate',
    url: '/images/gallery/art-6.jpg',
    span: 'col-span-1 row-span-2'
  },
  {
    id: 10,
    type: 'image',
    title: 'Artistic Excellence',
    desc: 'Premium quality prints that transform your space',
    url: '/images/gallery/art-8.jpg',
    span: 'col-span-2 row-span-2'
  }
]

export function ArtShowcaseGallery() {
  return (
    <section className="py-24 sm:py-32 border-t border-border/50 bg-[hsl(40,25%,98%)]">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <InteractiveBentoGallery
          mediaItems={artMediaItems}
          title="Discover Your Perfect Art Style"
          description="Explore our curated collection of artistic styles. Click, drag, and interact with each piece to find your inspiration."
        />
      </div>
    </section>
  )
}