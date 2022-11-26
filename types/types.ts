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

type Team = {
  country: string;
    goals: number | null;
    name: string;
    penalties: number | null;
}

type Match = {
  id: number;
  group: string;
  stadium: string;
  datetime: string;
  away_team: Team;
  home_team: Team;
};

export type { Player, Team, Match };
