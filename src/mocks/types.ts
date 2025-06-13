interface Contribution {
  id: number;
  guild_conquest_progress_id: number;
  character: {
    name: {
      raw: string;
      formatted: string;
    };
    total_level: number;
    image_url: string;
    background_url: string;
  };
  kills: number;
  experience: number;
}

export type DataGatherFromSite = Array<{
  location: {
    id: number;
    key: string;
    name: string;
    image_url: string;
  };
  contributions: Array<Contribution>;
  status: string;
  colour?: string;
  kills: number;
  experience: number;
  guilds_count: number;
  your_guild: {
    kills: number;
    experience: number;
    position: number;
  };
  active_assaults: Array<{
    guild: {
      name: string;
      url: string;
      tag?: string;
      icon_url: string;
    };
    kills: number;
    experience: number;
    started_at: string;
    ends_in: string;
  }>;
  guilds: Record<
    string,
    {
      id: number;
      position: number;
      kills: string;
      experience: string;
      contributions: Array<Contribution>;
      guild: {
        name: string;
        url: string;
        tag: string | null;
        icon_url: string;
        background_url: string;
      };
    }
  >;
}>;
