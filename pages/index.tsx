import moment from "moment";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { Match, Player, Team } from "../types/types";
import { winnerList } from "../winnerList";
import { useRouter } from "next/router";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

type Props = {
  players: Player[];
  fixtures: Match[];
};

export default function Home({ players, fixtures }: Props) {
  const router = useRouter();
  const [rankedPlayers, setRankedPlayers] = useState<Player[]>([])

  const rankPlayers = () => {
    let scores: number[] = [];
    players.map(player => {
      if (!scores.includes(player.score)) {
        scores.push(player.score);
      }
    });

    let newList = scores.map((score, index) => {
      return players.map(player => {
        if (player.score === score) {
          player.rank = index + 1;
          return player;
        }
        return player;
      });
    });

    return newList[0];
  };

  
  useEffect(() => {
    const reloadPage = () => {
      router.reload();
    };

    setRankedPlayers(rankPlayers());
    setTimeout(reloadPage, 5 * 60 * 1000);
  }, []);

  return (
    <div>
      <Head>
        <title>Bloopers Worldcup 2022</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/svgs/logo.svg" />
      </Head>
      <main className="flex sm:flex-row flex-col divide-x divide-gray-200 2xl:container mx-auto">
        <div className="p-8 space-y-8 sm:w-[1007px]">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-y-2 sm:gap-3 border-b border-gray-200 pb-6 ">
            <Image
              src="/svgs/2022_FIFA_World_Cup.svg"
              alt="cup"
              height={12}
              width={50}
            />
            <h1 className="font-qatar-2022-arabic font-bold text-primary-red -tracking-[0.02em] text-4xl sm:text-6xl sm:text-left text-center">
              Bloopers World Cup 2022
            </h1>
          </div>
          <div className="space-y-8">
            <div className="justify-between items-center sm:flex">
              <p className="font-semibold text-xl leading-[22px] font-qatar-2022-arabic text-center text-primary-red">
                Today&apos;s Matches
              </p>
              <p className="text-gray-400 text-sm text-center">
                Last updated at{" "}
                <span className="font-qatar-2022-arabic">
                  {moment(new Date().getTime()).format("hh:mm a")}
                </span>
              </p>
            </div>
            <div className="grid sm:grid-cols-2 w-max mx-auto gap-y-4">
              {fixtures.map((match, index) => (
                <MatchCard key={match.id} {...match} index={index} />
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <div className="sticky top-0 z-10 pt-3 bg-white ring-1 ring-white sm:ring-0">
              <p className="bg-primary-red font-qatar-2022-arabic text-white px-3 h-12 flex items-center rounded-lg -tracking-[0.02em] text-xl font-bold">
                Points Table
              </p>
            </div>
            <div className="sm:px-3 grid sm:grid-cols-2 gap-x-8">
              <div>
                {rankedPlayers.slice(0, 13).map((player, index) => (
                  <PlayerCard
                    showWinner
                    index={index + 1}
                    key={player.id}
                    {...player}
                  />
                ))}
              </div>
              <div>
                {rankedPlayers.slice(13).map((player, index) => (
                  <PlayerCard
                    index={index + 1}
                    {...player}
                    key={player.id}
                    secondList
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="w-full sm:w-[432px] space-y-6 px-8 sm:p-8">
          <p className="font-qatar-2022-arabic font-bold text-primary-red -tracking-[0.02em] text-3xl pb-3 sm:pb-12 border-b border-gray-200">
            Winners
          </p>
          <Carousel images={winnerList} />
          <div className="">
            <div className="flex justify-between sticky top-0 bg-white z-10">
              <p className="w-max font-qatar-2022-arabic font-bold text-primary-red -tracking-[0.02em] text-xl">
                Name
              </p>
              <p className="w-max font-qatar-2022-arabic font-bold text-primary-red -tracking-[0.02em] text-xl">
                Match day
              </p>
            </div>
            <div className="divide-y divide-gray-200">
              {winnerList.map((winner, index) => {
                const findWinner: Player | undefined = players.find(
                  player => player.name === winner.name
                );
                return findWinner ? (
                  <PlayerCard
                    index={winnerList.length - index}
                    showRank={false}
                    {...findWinner}
                    key={findWinner.id}
                  />
                ) : null;
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

type MatchCardProps = {
  datetime: string;
  away_team: Team;
  home_team: Team;
  index: number
  status: string;
};

const MatchCard = ({
  datetime,
  away_team,
  home_team,
  index,
  status
}: MatchCardProps) => {

  const statusLookup = {
    "in_progress": {
      text: "text-emerald-500",
      bg: "bg-emerald-500"
    },
    "future_scheduled": {
      text: "text-orange-400",
      bg: "bg-orange-400"
    },
    "completed": {
      text: "text-red-500",
      bg: "bg-red-500"
    },
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-x-2 text-center justify-center italic">
        <p className="max-w-16 whitespace-nowrap text-[#6D6D6D] ">
          {moment(datetime).format("hh:mm a")}
        </p>
        <p
          className={`capitalize ${
            statusLookup[status as keyof typeof statusLookup].text
          }`}
        >
          {status.split("_").join(" ")}
        </p>
        <div
          className={`w-2 h-2 rounded-full mt-2 ${
            status === "in_progress" ? "animate-pulse" : ""
          } ${statusLookup[status as keyof typeof statusLookup].bg}`}
        />
      </div>
      <div
        className={`flex items-center gap-x-3 sm:gap-x-6 justify-evenly sm:justify-start ${
          index % 2 === 0
            ? ""
            : "justify-evenly sm:pl-8 sm:border-l border-gray-200"
        } ${index > 1 ? "sm:pt-4" : ""}`}
      >
        <TeamCard {...home_team} />
        <p className="font-semibold text-xl leading-5 w-12 text-center whitespace-nowrap">
          {home_team.goals ?? "-"} : {away_team.goals ?? "-"}
        </p>
        <TeamCard {...away_team} isAway />
      </div>
    </div>
  );
};

type TeamCardProps = {
  name: string;
  country: string;
  isAway?: boolean;
};

const TeamCard = ({ name, country, isAway = false }: TeamCardProps) => {
  return (
    <div className={`flex items-center gap-x-3 ${isAway ? "flex-row-reverse" : "flex-row"}`}>
      <div className="w-10 h-10 sm:w-16 sm:h-16 relative">
        <Image
          alt={name}
          layout="fill"
          src={`/flags/512px/Flag_of_${name}.png`}
          className="object-cover rounded-full z-10 ring-1 ring-[#F5F5F5] shadow-md"
        />
      </div>
      <p className="font-bold leading-[10px] w-8">{country}</p>
    </div>
  );
};

type PlayerCardProps = {
  score: number,
  name: string,
  index: number,
  showRank?: boolean,
  showWinner?: boolean,
  rank: number,
  secondList?: boolean
}

const PlayerCard = ({ index, score, name, showRank = true, showWinner = false, rank, secondList }: PlayerCardProps) => {
  const borderColors = {
    1: "border-[#FFD700]",
    2: "border-[#C0C0C0]",
    3: "border-[#CD7F32]",
  }

  return (
    <div
      className={`flex items-center justify-between py-4 text-sm text-gray-500 border-gray-200 ${
        index > 1 && showRank && index !== 14
          ? "border-t "
          : "flex-reverse border-t sm:border-t-0"
      }
      ${showRank ? "px-6" : ""}`}
    >
      <div
        className={`${
          showRank ? "" : "justify-between w-full flex-row-reverse"
        } flex items-center gap-x-8 capitalize`}
      >
        <div className="relative">
          {showWinner && index === 1 ? (
            <p className="-inset-y-0.5 left-9 text-lg absolute">🏆</p>
          ) : null}
          <p
            className={
              !showRank
                ? "text-lg"
                : `text-sm rounded-full border-2 w-7 h-7 flex justify-center items-center ${!secondList ? borderColors[index as keyof typeof borderColors] : ""}`
            }
          >
            {showRank ? rank : index}
          </p>
        </div>
        <p className="text-gray-900 font-medium text-lg">{name}</p>
      </div>
      {showRank ? (
        <div className="flex gap-x-2 items-center">
          <p className="text-lg">{score}</p>
          <span className="text-lg">⚽️</span>
        </div>
      ) : null}
    </div>
  );
};

type CarouselTypes = {
  images: {
    image_path: string;
  }[];
};

const Carousel = ({ images }: CarouselTypes) => {
  const sliderRef = useRef<Slider | null>(null);

  const settings = {
    speed: 250,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    infinite: true,
  };
  return (
    <div className="w-full h-[413px] border-2 border-primary-red rounded-xl overflow-hidden">
      <Slider ref={sliderRef} {...settings}>
        {images.map((image, index) => (
          <div key={`image-${index}`} className="h-[420px] w-full relative ">
             <Image
              src={image.image_path}
              priority
              alt="framer"
              className="object-cover z-10"
              layout="fill"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const playersRes = await fetch(
    "https://keepthescore.co/api/gcxzugpegbr/board/"
  );
  const playersData = await playersRes.json();

  const fixtureRes = await fetch("https://worldcupjson.net/matches/today");
  const fixtureData = await fixtureRes.json();

  return {
    props: {
      players: playersData.players,
      fixtures: fixtureData,
    },
  };
};
