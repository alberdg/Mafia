import * as dayjs from 'dayjs';
import { Member } from './interfaces/Member';
import { Organization } from './interfaces/Organization';

export class MafiaImpl implements Organization {
  rootNode: Member;

  constructor(rootNode: Member) {
    this.rootNode = rootNode;
  }

  private getTreeAsQueue(node: Member, queue: Member[]) {
    for (const child of node.subordinates) {
      queue.push(child);
    }
    for (const child of node.subordinates) {
      this.getTreeAsQueue(child, queue);
    }
  }

  private breadthFirstSearch(root: Member, key: string, value: string | number, single: boolean = true): Member[] {
    const queue: Member[] = [root];
    this.getTreeAsQueue(root, queue);
    const result: Member[] = [];
    while (queue.length > 0) {
      const current: Member | null = queue.shift() ?? null;
      if (current === null) {
        continue;
      }

      if (current[key] === value && !current.jailed && !current.killed) {
        if (single) {
          return [current];
        }
        result.push(current);
      }
    }
    return result;
  }

  private getOldestSibling(siblings: Member[], memberIdToExclude: string): Member | null {
    const oldestJoinedDate = dayjs().unix();
    let oldestSibling: Member | null = null;
    siblings.forEach((sibling: Member) => {
      if (
        sibling.id !== memberIdToExclude &&
        !sibling.jailed &&
        !sibling.killed &&
        dayjs(sibling.dateJoined).unix() < oldestJoinedDate
      ) {
        oldestSibling = sibling;
      }
    });
    return oldestSibling;
  }

  private moveSubordinatesToTargetNode(member: Member, targetNode: Member): void {
    if (targetNode !== null) {
        member.subordinates.forEach((subordinate: Member) => {
         if (subordinate.id === targetNode!.id) {
            return;
         }
          targetNode!.subordinates.push({
            ...subordinate,
            oldBossId: !member.killed ? member.id : null,
            bossId: targetNode!.id,
          });
          member.subordinates = [];
        });
      }
  }

  private moveSubordinates(member: Member) : void {
    if (!member.subordinates.length) {
        return;
      }
      // find oldest sibling
      const result: Member[] | null = member.bossId ? this.breadthFirstSearch(this.rootNode, 'id', member.bossId) : null;
      let targetNode: Member | null = null;
      // Let's find oldest sibling
      if (Array.isArray(result) && result.length === 1) {
        targetNode = this.getOldestSibling(result[0].subordinates, member.id);
        if (targetNode) {
            // We found a sibling so move subordinates to the sibling
            this.moveSubordinatesToTargetNode(member, targetNode!);
        }
      }

      // if not oldest sibling find the oldest child and promote
      if (!targetNode) {
        targetNode = this.getOldestSibling(member.subordinates, member.id);
        if (targetNode) {
            // If oldest subordinate is found move subordinates to that node
            this.moveSubordinatesToTargetNode(member, targetNode!);    
            targetNode.bossId = member.bossId;
            targetNode.oldBossId = member.id;
            targetNode.rank = targetNode.rank > 0  ? targetNode.rank - 1 : 0;
            const result: Member[] | null = member.bossId ? this.breadthFirstSearch(this.rootNode, 'id', member.bossId) : null;
            if (Array.isArray(result) && result.length === 1) {
                result[0].subordinates.push(targetNode);
            }
        }
      }
      member.subordinates = [];
  }

  killMember(member: Member): void {
    // set killed to true
    member.killed = true;
    this.moveSubordinates(member);
  }

  jailMember(member: Member): void {
    // set jailed to true
    member.jailed = true;
    this.moveSubordinates(member);
  }

  releaseMember(member: Member): void {
    // set jailed to false
    member.jailed = false;
    // Traverse the tree to find children with oldBossId = member.id
    let formerMembers: Member[] = this.breadthFirstSearch(this.rootNode, 'oldBossId', member.id, false);
    formerMembers = formerMembers.map((subordinate: Member) => {
      const result: Member[] = subordinate.bossId
        ? subordinate.bossId === member.id ? [member] : this.breadthFirstSearch(this.rootNode, 'id', subordinate.bossId)
        : [];
      const currentBoss: Member | null = Array.isArray(result) && result.length === 1 ? result[0] : null;
      if (currentBoss) {
        // Remove each member found from his current boss
        currentBoss.subordinates = currentBoss.subordinates.filter((subordinate: Member) => subordinate.oldBossId !== member.id);
        // Remove each member found from subordinate
        subordinate.subordinates = subordinate.subordinates.filter((subordinate: Member) => subordinate.oldBossId !== member.id);
      }

      // Move each member found to former boss
      // Set correct rank
      return {
        ...subordinate,
        boss: member.id,
        oldBossId: null,
        rank: member.rank + 1,
      };
    });
    member.subordinates = formerMembers;
  }

  countSubordinates(member: Member): number {
    // Go through children recursively to get the count
    let subordinatesCount = 0;
    member.subordinates.forEach((subordinate: Member) => {
      subordinatesCount = subordinatesCount + 1 + this.countSubordinates(subordinate);
    });
    return subordinatesCount;
  }

  getMemberRankingHigher(memberA: Member, memberB: Member): number {
    if (memberA.rank < memberB.rank) {
      return 1;
    } else if (memberB.rank < memberA.rank) {
      return -1;
    }
    return 0;
  }
}
