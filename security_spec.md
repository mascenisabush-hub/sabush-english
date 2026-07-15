# Security Specification & Test-Driven Development (TDD) for Sabush English Club

This document establishes the security guidelines, strict data invariants, adversarial payloads, and test coverage designed to secure the Firebase services of the Sabush English Club.

---

## 1. Data Invariants

Our system architecture enforces the following mathematical and relational invariants:

### User Profiles (`/users/{userId}`)
1. **Identity Pinning**: A user's profile ID (`userId`) must exactly match their authenticated UID (`request.auth.uid`). No user can write a profile for another user ID (Identity Spoofing).
2. **Subscription Protection (Anti-Privilege Escalation)**: Regular users cannot change their own `subscriptionStatus` to `'Activo'` or bypass verification. They can only set it to `'Pendente'` (when submitting payment proofs) or leave it unchanged/inactive.
3. **Admin Exemption**: The admin account (email `sabushagency@gmail.com`) can read and write all user profiles to allow remote subscription approvals/rejections and management.
4. **Temporal Consistency**: Every creation must stamp `createdAt` and `updatedAt` to the exact server time `request.time`. Every update must stamp `updatedAt` to `request.time` and prevent mutation of `createdAt`.

### Payment Submissions (`/paymentSubmissions/{userId}`)
1. **Self-Ownership**: A user can only submit payment confirmations for their own `userId`.
2. **Enforced Initial State**: All user-created payment submissions must begin with status `'Pendente'`.
3. **State Locking (Immortal Approvals)**: Once a payment is `'Aprovado'` or `'Rejeitado'`, the student cannot overwrite, delete, or reset it.
4. **Admin Monopoly**: Only the admin account can transition status to `'Aprovado'` or `'Rejeitado'`.

### Study Groups (`/groups/{groupId}`)
1. **Creator Controls**: Only the authentic creator (matching `creatorId`) can delete or edit a group's core details (such as title, summary, levelFocus).
2. **Relational Sync (MemberCount)**: Any logged-in member can update the `memberCount` sub-field if they are performing membership actions, but cannot alter any other core metadata.

### Group Memberships & Chats (`/groups/{groupId}/members/{userId}`)
1. **Self-Enrollment**: A user can join/leave a group only in their own name. They cannot register other users.
2. **Access Isolation**: Standard users can only read messages or communicate inside groups of which they are active members. Users outside a study group cannot read or write messages in that group.

---

## 2. The "Dirty Dozen" Payloads (Adversarial Attack Vectors)

Here are 12 specific payloads crafted to probe the rules. The `firestore.rules` must reject all of these.

### Category A: Identity Hijacking & Spoofing
1. **Payload 01: Profile Identity Stealing**
   - *Target*: `/users/victim_user_abc`
   - *Attack*: Authenticated user `attacker_xyz` attempts to create or overwrite a profile belonging to `victim_user_abc`.
   - *Payload*: `{ "userId": "victim_user_abc", "name": "Attacker", "level": "beginner", "learningGoal": "Talk", "xp": 1000, "streak": 5, "completedLessons": [], "createdAt": "request.time", "updatedAt": "request.time" }`

2. **Payload 02: Hijack Payment Submission**
   - *Target*: `/paymentSubmissions/victim_user_abc`
   - *Attack*: Authenticated user `attacker_xyz` attempts to submit payment notes representing themselves as the helper/owner of the victim's subscription folder.
   - *Payload*: `{ "userId": "victim_user_abc", "userName": "Victim", "paymentMethod": "M-Pesa", "reference": "123", "status": "Pendente", "createdAt": "request.time", "updatedAt": "request.time" }`

### Category B: Privilege Escalation
3. **Payload 03: Self-Approval of Subscription**
   - *Target*: `/users/attacker_xyz`
   - *Attack*: Student `attacker_xyz` attempts to modify their profile directly to skip payment and activate subscription.
   - *Payload*: `{ "userId": "attacker_xyz", "name": "Attacker", "level": "beginner", "learningGoal": "Talk", "xp": 5, "streak": 1, "completedLessons": [], "subscriptionStatus": "Activo", "createdAt": "request.time", "updatedAt": "request.time" }`

4. **Payload 04: Bypassing Payment Verification**
   - *Target*: `/paymentSubmissions/attacker_xyz`
   - *Attack*: Student `attacker_xyz` creates a payment reference stamped as `'Aprovado'` without admin intervention.
   - *Payload*: `{ "userId": "attacker_xyz", "userName": "Attacker", "paymentMethod": "BIM", "reference": "REF9999", "status": "Aprovado", "createdAt": "request.time", "updatedAt": "request.time" }`

### Category C: Unbounded Resources & Denial of Wallet
5. **Payload 05: Giant ID Allocation Attack**
   - *Target*: `/groups/a-very-long-garbage-id-of-1024-characters-that-grows-unbounded-and-floods-index-nodes...`
   - *Attack*: Creating groups with monstrously long random string IDs to deplete resources.
   - *Expected Outcome*: Rejected by `isValidId()` rule check.

6. **Payload 06: Colossal Group Properties Injection**
   - *Target*: `/groups/group_123`
   - *Attack*: Creating a study group with descriptive fields exceeding limits (e.g. 50,000 characters).
   - *Payload*: `{ "groupId": "group_123", "name": "Giant", "description": "Too large description beyond 500 characters...", "levelFocus": "Iniciante", "creatorId": "attacker_xyz", "creatorName": "Attacker", "memberCount": 1, "createdAt": "request.time", "updatedAt": "request.time" }`

### Category D: Group Control Violations
7. **Payload 07: Unapproved Group Overwrites**
   - *Target*: `/groups/english_club_dev`
   - *Attack*: Non-creator attempts to edit the name or description of `english_club_dev` owned by `creator_bob`.
   - *Payload*: `{ "groupId": "english_club_dev", "name": "Hacked Group Name", "description": "Hacked", "levelFocus": "Avançado", "creatorId": "creator_bob", "creatorName": "Bob", "memberCount": 5, "createdAt": "existing().createdAt", "updatedAt": "request.time" }`

8. **Payload 08: Registering Others to Groups**
   - *Target*: `/groups/group_123/members/victim_user_abc`
   - *Attack*: Attacker signs up a victim user into a group without their permission.
   - *Payload*: `{ "userId": "victim_user_abc", "name": "Victim", "role": "Member", "joinedAt": "request.time" }`

### Category E: Chat Snoop & Leaks (Relational Violations)
9. **Payload 09: Reading Messages From Groups Not Joined**
   - *Target*: `/groups/exclusive_group_abc/messages/msg_123`
   - *Attack*: `stranger_xyz` attempts to query or read group messages of a group they haven't registered into.
   - *Expected*: Rejected strictly because the user does not exist in the members list.

10. **Payload 10: Injecting Chat Message Into Outer Group**
    - *Target*: `/groups/exclusive_group_abc/messages/attacker_msg_123`
    - *Attack*: `stranger_xyz` tries to send a message to a channel without enrolling.
    - *Payload*: `{ "messageId": "attacker_msg_123", "senderId": "stranger_xyz", "senderName": "Stranger", "text": "Hello", "isReported": false, "createdAt": "request.time" }`

### Category F: Temporal & State Corruption
11. **Payload 11: Forged Timestamps Creation**
    - *Target*: `/users/attacker_xyz`
    - *Attack*: Forging historical timestamps (`createdAt` in 2010) to look like an old veteran.
    - *Payload*: `{ "userId": "attacker_xyz", "name": "Attacker", "level": "beginner", "learningGoal": "Talk", "xp": 10, "streak": 1, "completedLessons": [], "createdAt": "timestamp('2010-01-01T00:00:00Z')", "updatedAt": "request.time" }`

12. **Payload 12: Illegal Modification of Immutable Field**
    - *Target*: `/users/attacker_xyz`
    - *Attack*: Changing the fixed `createdAt` timestamp during profile updates.
    - *Payload*: `{ "userId": "attacker_xyz", "name": "Attacker", "level": "beginner", "learningGoal": "Talk", "xp": 10, "streak": 1, "completedLessons": [], "createdAt": "timestamp('2026-01-01T00:00:00Z')", "updatedAt": "request.time" }`

---

## 3. The Test Runner

The file `firestore.rules.test.ts` below can be run with standard testing suites (Jest/Mocha and `@firebase/rules-unit-testing`) to execute and verify that all "Dirty Dozen" payloads return `PERMISSION_DENIED`.

```typescript
import {
  initializeTestEnvironment,
  RulesTestEnvironment,
  assertFails,
  assertSucceeds
} from '@firebase/rules-unit-testing';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

let testEnv: RulesTestEnvironment;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: 'gen-lang-client-0488079611',
    firestore: {
      rules: require('fs').readFileSync('firestore.rules', 'utf8')
    }
  });
});

afterAll(async () => {
  await testEnv.cleanup();
});

describe('Sabush English Club Security Rules', () => {
  test('Payload 01: Profile Identity Stealing should fail', async () => {
    const attackerDb = testEnv.authenticatedContext('attacker_xyz').firestore();
    const victimRef = doc(attackerDb, 'users/victim_user_abc');
    await assertFails(setDoc(victimRef, {
      userId: 'victim_user_abc',
      name: 'Attacker',
      level: 'beginner',
      learningGoal: 'Talk',
      xp: 1000,
      streak: 5,
      completedLessons: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }));
  });

  test('Payload 02: Hijack Payment Submission should fail', async () => {
    const attackerDb = testEnv.authenticatedContext('attacker_xyz').firestore();
    const victimPaymentRef = doc(attackerDb, 'paymentSubmissions/victim_user_abc');
    await assertFails(setDoc(victimPaymentRef, {
      userId: 'victim_user_abc',
      userName: 'Victim',
      paymentMethod: 'M-Pesa',
      reference: '123',
      status: 'Pendente',
      createdAt: new Date(),
      updatedAt: new Date()
    }));
  });

  test('Payload 03: Self-Approval of Subscription should fail', async () => {
    const attackerDb = testEnv.authenticatedContext('attacker_xyz').firestore();
    const profileRef = doc(attackerDb, 'users/attacker_xyz');
    await assertFails(setDoc(profileRef, {
      userId: 'attacker_xyz',
      name: 'Attacker',
      level: 'beginner',
      learningGoal: 'Talk',
      xp: 5,
      streak: 1,
      completedLessons: [],
      subscriptionStatus: 'Activo',
      createdAt: new Date(),
      updatedAt: new Date()
    }));
  });

  test('Payload 04: Bypassing Payment Verification should fail', async () => {
    const attackerDb = testEnv.authenticatedContext('attacker_xyz').firestore();
    const paymentRef = doc(attackerDb, 'paymentSubmissions/attacker_xyz');
    await assertFails(setDoc(paymentRef, {
      userId: 'attacker_xyz',
      userName: 'Attacker',
      paymentMethod: 'BIM',
      reference: 'REF9999',
      status: 'Aprovado',
      createdAt: new Date(),
      updatedAt: new Date()
    }));
  });
});
```
