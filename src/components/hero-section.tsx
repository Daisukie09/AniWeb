"use client";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "./ui/carousel";

import Container from "./container";
import { Button } from "./ui/button";
import parse from "html-react-parser";

import React from "react";
import { ArrowLeft, ArrowRight, Captions, Mic, Play, Info, Sparkles } from "lucide-react";

import { ROUTES } from "@/constants/routes";
import { ButtonLink } from "./common/button-link";
import { SpotlightAnime } from "@/types/anime";
import { Badge } from "./ui/badge";

type IHeroSectionProps = {
  spotlightAnime: SpotlightAnime[];
  isDataLoading: boolean;
};

const HeroSection = (props: IHeroSectionProps) => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  if (props.isDataLoading) return <LoadingSkeleton />;

  return (
    <div className="h-[85vh] w-full relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20 z-0" />
      
      <Carousel 
        className="w-full h-full" 
        setApi={setApi} 
        opts={{ loop: true }}
      >
        <CarouselContent className="h-full">
          {props?.spotlightAnime?.map((anime, index) => (
            <CarouselItem key={index} className="h-full">
              <HeroCarouselItem anime={anime} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Navigation Arrows */}
      <div className="absolute hidden md:flex items-center gap-4 right-10 bottom-32 z-50">
        <Button
          onClick={() => api?.scrollPrev()}
          className="rounded-full bg-white/10 backdrop-blur-md border border-white/20 h-12 w-12 hover:bg-white/20 transition-all duration-300 group"
        >
          <ArrowLeft className="text-white shrink-0 w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
        </Button>
        <Button
          onClick={() => api?.scrollNext()}
          className="rounded-full bg-white/10 backdrop-blur-md border border-white/20 h-12 w-12 hover:bg-white/20 transition-all duration-300 group"
        >
          <ArrowRight className="text-white shrink-0 w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
        </Button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2">
        {props?.spotlightAnime?.map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              current === index 
                ? "w-8 bg-gradient-to-r from-purple-500 to-pink-500" 
                : "w-1.5 bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const HeroCarouselItem = ({ anime }: { anime: SpotlightAnime }) => {
  return (
    <div className="w-full h-full relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${anime?.poster})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-anime-dark via-anime-dark/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-anime-dark via-transparent to-anime-dark/50" />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-pink-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Content */}
      <div className="relative z-20 w-full h-full">
        <Container className="w-full h-full flex flex-col justify-center pb-20">
          <div className="max-w-2xl space-y-6 animate-fade-in-up">
            {/* Featured Badge */}
            <div className="flex items-center gap-2">
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 px-3 py-1 text-xs font-semibold">
                <Sparkles className="w-3 h-3 mr-1" />
                SPOTLIGHT
              </Badge>
              <Badge variant="secondary" className="bg-white/10 backdrop-blur-sm text-white border-0">
                {anime?.otherInfo?.[0]}
              </Badge>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight drop-shadow-2xl">
              {anime?.name}
            </h1>

            {/* Episode Badges */}
            <div className="flex flex-wrap items-center gap-3">
              {anime?.episodes?.sub && (
                <Badge className="bg-purple-500/90 hover:bg-purple-500 text-white border-0 flex items-center gap-1.5 px-3 py-1">
                  <Captions className="w-4 h-4" />
                  <span>{anime.episodes.sub} Episodes</span>
                </Badge>
              )}
              {anime?.episodes?.dub && (
                <Badge className="bg-pink-500/90 hover:bg-pink-500 text-white border-0 flex items-center gap-1.5 px-3 py-1">
                  <Mic className="w-4 h-4" />
                  <span>{anime.episodes.dub} Dubbed</span>
                </Badge>
              )}
              {anime?.otherInfo?.slice(1, 3).map((info, idx) => (
                <Badge 
                  key={idx} 
                  variant="outline" 
                  className="border-white/20 text-white/80 bg-white/5 backdrop-blur-sm"
                >
                  {info}
                </Badge>
              ))}
            </div>

            {/* Description */}
            <p className="text-base md:text-lg text-white/70 line-clamp-3 leading-relaxed">
              {parse(anime?.description as string)}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <ButtonLink
                href={`${ROUTES.ANIME_DETAILS}/${anime.id}`}
                className="h-12 px-8 text-base font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-0 rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2"
              >
                <Play className="w-5 h-5 fill-white" />
                Watch Now
              </ButtonLink>
              
              <ButtonLink 
                href={`${ROUTES.ANIME_DETAILS}/${anime.id}`}
                className="h-12 px-8 text-base font-semibold bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/20 rounded-xl transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2"
              >
                <Info className="w-5 h-5" />
                Details
              </ButtonLink>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

const LoadingSkeleton = () => {
  return (
    <div className="h-[85vh] w-full relative bg-anime-dark overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-pink-900/10" />
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] animate-pulse" />
      </div>
      
      <div className="relative z-20 w-full h-full">
        <Container className="w-full h-full flex flex-col justify-center pb-20">
          <div className="max-w-2xl space-y-6">
            <div className="h-8 w-32 animate-pulse bg-white/10 rounded-full" />
            <div className="h-16 md:h-20 w-3/4 animate-pulse bg-white/10 rounded-2xl" />
            <div className="flex gap-3">
              <div className="h-8 w-24 animate-pulse bg-white/10 rounded-full" />
              <div className="h-8 w-24 animate-pulse bg-white/10 rounded-full" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full animate-pulse bg-white/5 rounded" />
              <div className="h-4 w-full animate-pulse bg-white/5 rounded" />
              <div className="h-4 w-2/3 animate-pulse bg-white/5 rounded" />
            </div>
            <div className="flex gap-4 pt-4">
              <div className="h-12 w-40 animate-pulse bg-white/10 rounded-xl" />
              <div className="h-12 w-40 animate-pulse bg-white/10 rounded-xl" />
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default HeroSection;
