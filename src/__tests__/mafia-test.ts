import { v4 as uuid } from 'uuid';
import * as dayjs from 'dayjs';
import { Member } from '../interfaces/Member';
import { Organization } from '../interfaces/Organization';
import { MafiaImpl } from '../Mafia';

const createNode = (bossId: string | null, rank, id = uuid()): Member => {
  return {
    id,
    dateJoined: dayjs()
      .subtract(Math.floor(Math.random() * 10) + 1, 'day')
      .toISOString(),
    bossId,
    subordinates: [],
    jailed: false,
    killed: false,
    oldBossId: null,
    rank,
  };
};

const createOrganization = () => {
  memberA = createNode(rootNode.id, 2, 'A');
  memberB = createNode(rootNode.id, 2, 'B');
  memberC = createNode(rootNode.id, 2, 'C');
  memberD = createNode(memberA.id, 3, 'D');
  memberE = createNode(memberA.id, 3, 'E');
  memberF = createNode(memberA.id, 3, 'F');
  memberA.subordinates = [memberD, memberE, memberF];
  memberG = createNode(memberB.id, 3, 'G');
  memberB.subordinates = [memberG];
  memberH = createNode(memberC.id, 3, 'H');
  memberI = createNode(memberC.id, 3, 'I');
  memberJ = createNode(memberI.id, 4, 'J');
  memberK = createNode(memberJ.id, 5, 'K');
  memberJ.subordinates = [memberK];
  memberI.subordinates = [memberJ];
  memberC.subordinates = [memberH, memberI];
  rootNode.subordinates = [memberA, memberB, memberC];
};

let mafia: Organization;
let rootNode: Member;
let memberA: Member;
let memberB: Member;
let memberC: Member;
let memberD: Member;
let memberE: Member;
let memberF: Member;
let memberG: Member;
let memberH: Member;
let memberI: Member;
let memberJ: Member;
let memberK: Member;
beforeEach(() => {
  rootNode = createNode(null, 1, 'Boss');
  createOrganization();
  mafia = new MafiaImpl(rootNode);
});

it('Counts the number of subordinates', () => {
  const count = mafia.countSubordinates(memberC);
  expect(count).toEqual(4);
});

it('Gets what member ranks higher in the organization', () => {
  let result = mafia.getMemberRankingHigher(memberA, memberJ);
  expect(result).toEqual(1);
  result = mafia.getMemberRankingHigher(memberA, memberB);
  expect(result).toEqual(0);
  result = mafia.getMemberRankingHigher(memberH, memberC);
  expect(result).toEqual(-1);
});

it('Jails a member and moves his subordinates', () => {
  expect(memberB.subordinates.length).toBe(1);
  mafia.jailMember(memberC);
  expect(memberC.jailed).toBeTruthy();
  expect(memberC.subordinates.length).toEqual(0);
  expect(memberB.subordinates.length).toBe(3);
});

it('Gets former subordinates back after being release', () => {
  expect(memberB.subordinates.length).toBe(1);
  expect(memberC.subordinates.length).toBe(2);
  mafia.jailMember(memberC);
  expect(memberC.jailed).toBeTruthy();
  expect(memberC.subordinates.length).toEqual(0);
  expect(memberB.subordinates.length).toBe(3);
  mafia.releaseMember(memberC);
  expect(memberC.jailed).toBeFalsy();
  expect(memberC.subordinates.length).toEqual(2);
  expect(memberB.subordinates.length).toBe(1);
});

it('Kills a member and moves his subordinates', () => {
  expect(memberB.subordinates.length).toBe(1);
  mafia.killMember(memberC);
  expect(memberC.killed).toBeTruthy();
  expect(memberC.subordinates.length).toEqual(0);
  expect(memberB.subordinates.length).toBe(3);
});

it('Promotes a member when his boss was jailed and had no siblings', () => {
    rootNode.subordinates = [memberA];
    expect(memberF.subordinates.length).toEqual(0);
    expect(memberF.rank).toEqual(3);
    mafia.jailMember(memberA);
    expect(memberA.jailed).toBeTruthy();
    expect(memberA.subordinates.length).toEqual(0);
    expect(memberF.subordinates.length).toEqual(2);
    expect(memberF.rank).toEqual(2);    
});

it('Demotes a member when his boss is released and he was previously promoted', () => {
    rootNode.subordinates = [memberA];
    expect(memberA.subordinates.length).toEqual(3);
    expect(memberF.subordinates.length).toEqual(0);
    expect(memberF.rank).toEqual(3);
    mafia.jailMember(memberA);
    expect(memberA.jailed).toBeTruthy();
    expect(memberA.subordinates.length).toEqual(0);
    expect(memberF.subordinates.length).toEqual(2);
    expect(memberF.rank).toEqual(2);
    mafia.releaseMember(memberA);
    expect(memberA.jailed).toBeFalsy();
    expect(memberA.subordinates.length).toEqual(3);
    expect(memberF.subordinates.length).toEqual(0);
    expect(memberF.rank).toEqual(2);    
});
