export interface GuildsSummaryLatestDBResult {
  updatedAt: string;
  locationKey: string;
  guildId: number;
  guildName: string;
  guildIcon: string;
  totalExp: number;
  kills: number;
  killToExpRatio: number;
  participantsCount: number;
  bestPlayerName: string;
  bestPlayerTotalLevel: number;
  bestPlayerAvatar: string;
  bestPlayerBackground: string;
  bestPlayerKills: number;
  bestPlayerExperience: number;
  bestPlayerHasMembership: boolean;
}

export interface GetGuildsResponse {
  updatedAt: string;
  data: GuildEntry[];
}

export interface GuildEntry {
  locationKey: string;
  guildId: number;
  guildName: string;
  guildIcon: string;
  totalExp: number;
  kills: number;
  killToExpRatio: number;
  participantsCount: number;
  bestPlayer: {
    name: string;
    totalLevel: number;
    avatar: string;
    background: string;
    kills: number;
    experience: number;
    hasMembership: boolean;
  };
}
