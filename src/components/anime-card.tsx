import React from "react";
import Link from "next/link";
import Image from "next/image";

import { cn, formatSecondsToMMSS } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { Captions, Mic, Play, Clock } from "lucide-react";
import { WatchHistory } from "@/hooks/use-get-bookmark";
import { Progress } from "./ui/progress";

type Props = {
  className?: string;
  poster: string;
  title: string;
  episodeCard?: boolean;
  sub?: number | null;
  dub?: number | null;
  subTitle?: string;
  displayDetails?: boolean;
  variant?: "sm" | "lg";
  href?: string;
  showGenre?: boolean;
  watchDetail?: WatchHistory | null;
};

const AnimeCard = ({
  displayDetails = true,
  variant = "sm",
  ...props
}: Props) => {
  const safeCurrent =
    typeof props.watchDetail?.current === "number"
      ? props.watchDetail.current
      : 0;
  const safeTotal =
    typeof props.watchDetail?.timestamp === "number" &&
    props.watchDetail.timestamp > 0
      ? props.watchDetail.timestamp
      : 0;

  const clampedCurrent = Math.min(safeCurrent, safeTotal);

  const percentage = safeTotal > 0 ? (clampedCurrent / safeTotal) * 100 : 0;

  return (
    <Link href={props.href as string} className="block group">
      <div
        className={cn([
          "relative cursor-pointer rounded-2xl overflow-hidden",
          "transition-all duration-500 ease-out",
          "hover:shadow-glow hover:-translate-y-2 hover:scale-[1.02]",
          variant === "sm" &&
            "h-[12rem] min-[320px]:h-[16.625rem] sm:h-[18rem] max-w-[12.625rem] md:min-w-[12rem]",
          variant === "lg" &&
            "max-w-[12.625rem] md:max-w-[18.75rem] h-auto md:h-[25rem] shrink-0 lg:w-[18.75rem]",
          props.className,
        ])}
      >
        {/* Image Container */}
        <div className="relative w-full h-full">
          <Image
            src={props.poster}
            alt={props.title}
            height={400}
            width={300}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            unoptimized
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 transform scale-50 group-hover:scale-100 transition-transform duration-300">
              <Play className="w-6 h-6 text-white fill-white ml-1" />
            </div>
          </div>

          {/* Badges */}
          {props.episodeCard && (
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {props.sub && (
                <Badge className="bg-purple-500/90 hover:bg-purple-500 text-white text-xs font-medium px-2 py-0.5 backdrop-blur-sm flex items-center gap-1">
                  <Captions className="w-3 h-3" />
                  <span>SUB</span>
                </Badge>
              )}
              {props.dub && (
                <Badge className="bg-pink-500/90 hover:bg-pink-500 text-white text-xs font-medium px-2 py-0.5 backdrop-blur-sm flex items-center gap-1">
                  <Mic className="w-3 h-3" />
                  <span>DUB</span>
                </Badge>
              )}
            </div>
          )}

          {/* Watch Progress */}
          {props.watchDetail && percentage > 0 && (
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <div className="w-full">
                <Progress 
                  value={percentage} 
                  className="h-1 bg-white/20 [&>div]:bg-gradient-to-r [&>div]:from-purple-500 [&>div]:to-pink-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Content Details */}
        {displayDetails && (
          <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <h5 className="text-white font-semibold text-sm line-clamp-2 mb-1 drop-shadow-lg">
              {props.title}
            </h5>
            
            {props.watchDetail && (
              <div className="flex items-center gap-2 text-xs text-white/70 mb-2">
                <Clock className="w-3 h-3" />
                <span>Ep {props.watchDetail.episodeNumber}</span>
                <span className="text-white/40">•</span>
                <span>{formatSecondsToMMSS(props.watchDetail.current)}</span>
              </div>
            )}
            
            {props.episodeCard ? (
              <div className="flex flex-wrap items-center gap-2">
                {!props.sub && props.subTitle && (
                  <span className="text-xs text-white/60">{props.subTitle}</span>
                )}
              </div>
            ) : (
              props.subTitle && (
                <span className="text-xs text-white/60">{props.subTitle}</span>
              )
            )}
          </div>
        )}
      </div>
    </Link>
  );
};

export default AnimeCard;
