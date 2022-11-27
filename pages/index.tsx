import axios from "axios";
import moment from "moment";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { Match, Player, Team } from "../types/types";
import { winnerList } from "../winnerList";
import Lottie from 'react-lottie';
import trophy from "../public/677-trophy.json"
import football from "../public/rolling-footbll.json"
import converter from "number-to-words"
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
  useEffect(() => {
    const reloadPage = setTimeout(() => router.reload(), 50);
    clearTimeout(reloadPage);
  }, []);

  return (
    <div>
      <Head>
        <title>Bloopers Worldcup 2022</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/logo.svg" />
      </Head>
      <main className="flex sm:flex-row flex-col divide-x divide-gray-200 2xl:container mx-auto">
        <div className="p-8 space-y-8 sm:w-[1007px]">
          <h1 className="font-qatar-2022-arabic font-bold text-primary-red -tracking-[0.02em] text-4xl sm:text-6xl border-b border-gray-200 pb-6 sm:text-left text-center">
            Bloopers Worldcup 2022
          </h1>
          <div className="space-y-4 ">
            <p className="text-gray-900 font-semibold text-xl leading-[22px] text-center">
              Today&apos;s Matches
            </p>
            <div className="grid sm:grid-cols-2 w-max mx-auto sm:gap-0 gap-y-2">
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
            <div className="px-3 grid sm:grid-cols-2 gap-x-8">
              <div>
                {players.slice(0, 13).map((player, index) => (
                  <PlayerCard
                    showWinner
                    index={index + 1}
                    key={player.id}
                    {...player}
                  />
                ))}
              </div>
              <div>
                {players.slice(13).map((player, index) => (
                  <PlayerCard index={index + 14} {...player} key={player.id} />
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
                const findWinner = players.find(
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
};

const MatchCard = ({
  datetime,
  away_team,
  home_team,
  index,
}: MatchCardProps) => {
  return (
    <div className={`flex items-center gap-x-6 justify-evenly sm:justify-start ${index % 2 === 0 ? "" : "justify-evenly sm:pl-8 sm:border-l border-gray-200"} ${index > 1 ? "sm:pt-4" : ""}`}>
      <p className="max-w-16 whitespace-nowrap italic text-[#6D6D6D]">{moment(datetime).format("hh:mm a")}</p>
      <TeamCard {...home_team} />
      <p className="font-semibold text-xl leading-5 w-10">
        {home_team.goals ?? "-"} : {away_team.goals ?? "-"}
      </p>
      <TeamCard {...away_team} isAway />
    </div>
  );
};

type TeamCardProps = {
  name: string;
  country: string;
  isAway?: boolean;
};

const TeamCard = ({ name, country, isAway = false }: TeamCardProps) => {
  const [useName, setUseName] = useState("");

  const getFlag = async () => {
    try {
      const response = await axios.get(
        `https://countryflagsapi.com/png/${country}`
      );

      if (response.status === 200) {
        setUseName(response.data.includes("<!DOCTYPE html>"));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getFlag();
  }, [name]);

  return (
    <div className={`flex items-center gap-x-3 ${isAway ? "flex-row-reverse" : "flex-row"}`}>
      <div className="w-8 h-8 sm:w-12 sm:h-12 relative">
        <Image
          alt={name}
          layout="fill"
          src={`https://countryflagsapi.com/png/${useName ? name : country}`}
          className="object-cover rounded-full z-10 ring-1 ring-[#F5F5F5]"
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
}

const PlayerCard = ({ index, score, name, showRank = true, showWinner = false }: PlayerCardProps) => {
  const trophyOptions = {
    animationData: trophy,
    autoplay: true,
    loop: false,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  }

  const footballOptions = {
    animationData: football,
    autoplay: false,
    loop: false,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  }
  
  
  return (
    <div
      className={`flex items-center justify-between py-4 text-sm text-gray-500 ${
        index > 1 && showRank && index !== 14
          ? "border-t border-gray-200"
          : "flex-reverse"
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
                : "text-sm rounded-full border w-7 h-7 flex justify-center items-center"
            }
          >
            {index}
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
    autoplaySpeed: 1500,
    infinite: true,
  };
  return (
    <div className="w-full h-[413px] border-2 border-primary-red rounded-xl overflow-hidden">
      <Slider ref={sliderRef} {...settings}>
        {images.map((image, index) => (
          <div key={`image-${index}`} className="h-[413px] relative ">
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
