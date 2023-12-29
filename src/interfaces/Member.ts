export interface Member {
    id: string;
    bossId: string | null;
    oldBossId: string | null;
    rank: number;
    dateJoined: string;
    subordinates: Member[];
    jailed: boolean;
    killed: boolean;
}