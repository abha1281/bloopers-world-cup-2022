type Player = {
  id: number;
  score: number;
  name: string;
  team: string;
  background_colour: string;
  profile_image: string;
  text_colour: string;
  is_eliminated: boolean;
  trophy: boolean;
};

type Match = {
  group: string;
  stadium: string;
  date: string;
  time: string;
  teams: {
    name: string;
    image: string;
  }[];
};

export type { Player, Match };
