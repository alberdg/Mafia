import { Member } from "./Member";


export interface Organization {
    rootNode: Member;
    jailMember(member: Member): void;
    releaseMember(member: Member): void;
    killMember(member: Member): void;
    countSubordinates(member: Member): number;
    getMemberRankingHigher(memberA: Member, memberB: Member): number;
}