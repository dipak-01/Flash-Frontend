'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
// No import needed - will use regular img tag instead of next/image

const tiles = [
  { id: 1, src: "https://images.pexels.com/photos/2834917/pexels-photo-2834917.jpeg?auto=compress&cs=tinysrgb&w=600?height=600&width=400", alt: "Basketball", caption: "Basketball" },
  { id: 2, src: "https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=600?height=600&width=400", alt: "Soccer", caption: "Soccer" },
  { id: 3, src: "https://images.pexels.com/photos/3207474/pexels-photo-3207474.jpeg?auto=compress&cs=tinysrgb&w=600?height=600&width=400", alt: "Tennis", caption: "Tennis" },
  { id: 4, src: "https://images.pexels.com/photos/1263426/pexels-photo-1263426.jpeg?auto=compress&cs=tinysrgb&w=600?height=600&width=400", alt: "Volleyball", caption: "Volleyball" },
  { id: 5, src: "https://images.pexels.com/photos/13340208/pexels-photo-13340208.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load?height=600&width=400", alt: "Swimming", caption: "Swimming" },
  { id: 6, src: "https://images.pexels.com/photos/25286519/pexels-photo-25286519/free-photo-of-competitors-running-rndurance-test-in-sports-hall.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load?height=600&width=400", alt: "Athletics", caption: "Athletics" },
]

export default function Component() {
  const [currentIndex, setCurrentIndex] = useState(3) // Start at the first real slide
  const [isTransitioning, setIsTransitioning] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)

  const visibleTiles = 3
  const clonedTiles = [
    ...tiles.slice(-visibleTiles), // Clone last few tiles at the start
    ...tiles,
    ...tiles.slice(0, visibleTiles), // Clone first few tiles at the end
  ]

  const moveToIndex = useCallback((index: number, immediate = false) => {
    if (immediate) {
      if (carouselRef.current) {
        carouselRef.current.style.transition = 'none'; // Disable transition
      }
      setCurrentIndex(index);
      requestAnimationFrame(() => {
        if (carouselRef.current) {
          carouselRef.current.style.transition = ''; // Re-enable transition
        }
      });
    } else {
      setIsTransitioning(true);
      setCurrentIndex(index);
    }
  }, [])

  const handleTransitionEnd = useCallback(() => {
    setIsTransitioning(false);
    if (currentIndex >= tiles.length + visibleTiles) {
      // If reached the end clones, reset to the original first slide
      moveToIndex(visibleTiles, true);
    } else if (currentIndex < visibleTiles) {
      // If reached the start clones, reset to the original last slide
      moveToIndex(tiles.length + currentIndex, true);
    }
  }, [currentIndex, moveToIndex, tiles.length, visibleTiles])

  const nextSlide = useCallback(() => {
    if (!isTransitioning) {
      moveToIndex(currentIndex + 1)
    }
  }, [currentIndex, isTransitioning, moveToIndex])

  const prevSlide = useCallback(() => {
    if (!isTransitioning) {
      moveToIndex(currentIndex - 1)
    }
  }, [currentIndex, isTransitioning, moveToIndex])

  const currentIndexRef = useRef(currentIndex);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!isTransitioning) {
        moveToIndex(currentIndexRef.current + 1);
      }
    }, 5000);
    return () => clearInterval(intervalId);
  }, [currentIndex, isTransitioning, moveToIndex]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        prevSlide()
      } else if (event.key === 'ArrowRight') {
        nextSlide()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nextSlide, prevSlide])

  return (
    <section className="my-16 px-4 md:px-0" aria-label="Sports Tile Carousel">
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="relative">
            <div
              ref={carouselRef}
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${(currentIndex * 100) / visibleTiles}%)` }}
              onTransitionEnd={handleTransitionEnd}
            >
              {clonedTiles.map((tile, index) => (
                <div key={index} className="w-1/3 flex-shrink-0 px-2">
                  <Card className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="relative h-[500px]">
                        <img
                          src={tile.src}
                          alt={tile.alt}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold">{tile.caption}</h3>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="absolute top-1/2 -left-4 transform -translate-y-1/2"
              onClick={prevSlide}
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute top-1/2 -right-4 transform -translate-y-1/2"
              onClick={nextSlide}
              aria-label="Next slide"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}