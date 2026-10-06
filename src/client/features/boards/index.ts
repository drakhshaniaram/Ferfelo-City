/**
 * The boards on the walls. In coding mode: Issues, PRs, Services, Task queue.
 * In Academy mode: Scenes, Phrase wall, Services (staff), Practice queue — immersive learning.
 */
import type * as THREE from 'three';
import { boardLabelsFor, kioskSignFor } from '../../../shared/academy-boards';
import type { StationKind } from '../../../shared/layout';
import { cityOf } from '../../../shared/cities';
import { phrasesForCity, scenesForCity, type CityScene } from '../../../shared/cities/scenes';
import { isAcademyMode } from '../../../shared/mode';
import type { GhIssue } from '../../../shared/protocol';
import type { Ctx } from '../../core/context';
import { aside, boardHint, hintTitle, key, onE } from '../../core/hint';
import { skinIdleAgents, type IdleAgent } from '../../core/stations';
import { store, type Topic } from '../../state';
import { setPendingScene } from '../../state/pending-scene';
import { openBoard } from '../../ui/boards';
import { inProgress } from '../../ui/github/progress';
import type { BoardActions } from '../../ui/github/prompts';
import { clip, toast } from '../../ui/dom';
import { openIssue } from '../../ui/pull';
import { openServices } from '../../ui/services';
import { openPhrasesBoard, openPracticeQueue, openScenesBoard } from './academy-ui';
import { PhrasesBoardTexture, PracticeQueueTexture, ScenesBoardTexture } from './academy-textures';
import { BoardTexture, QueueBoardTexture, ServicesBoardTexture } from './world';
import { MachineTexture } from './machine';
import { MeetingBoardTexture, MeetingSignTexture } from './meeting';
import type { World } from '../../world/world';

declare module '../../world/types' {
  interface InteractKinds {
    issues: true;
    pulls: true;
    services: true;
    queue: true;
  }
}

export interface BoardsDeps {
  aimedNote(): GhIssue | null;
  pickUp(it: GhIssue): void;
  boardActions(): BoardActions;
  showQueue(): void;
  idleAgents(): IdleAgent[];
}

export function installBoards(ctx: Ctx, deps: BoardsDeps) {
  const { office } = ctx;

  function mountBoard(mesh: THREE.Mesh | undefined, texture: THREE.Texture, render: () => void, topics: Topic[]) {
    if (mesh) showOn(mesh, texture);
    for (const topic of topics) store.on(topic, render);
    render();
  }
  function showOn(mesh: THREE.Mesh, texture: THREE.Texture) {
    const mat = mesh.material as THREE.MeshBasicMaterial;
    if (mat.map === texture) return;
    mat.map = texture;
    mat.needsUpdate = true;
  }
  function academy() {
    return isAcademyMode(store.mode);
  }
  function cityName() {
    return cityOf(store.currentFloor()?.cityId)?.name ?? 'Campus';
  }
  function cityId() {
    return store.currentFloor()?.cityId;
  }
  function practiceActive() {
    return [...store.workers.values()]
      .filter((w) => w.fellowId)
      .map((w) => ({ name: w.name, scene: (w.task?.name || w.prompt || 'In a scene').slice(0, 80) }));
  }
  function startScene(s: CityScene) {
    setPendingScene({ sceneNote: s.sceneNote, fellowId: s.fellowId, title: s.title });
    toast(`🎭 “${s.title}” ready — empty desk → E`, 'info');
  }

  function offBoard(): Set<number> {
    const off = new Set<number>();
    const carrying = ctx.carrying();
    if (carrying) off.add(carrying.issue);
    for (const p of store.peers.values()) if (p.carrying && p.id !== store.you && store.onMyFloor(p)) off.add(p.carrying.issue);
    return off;
  }

  const issuesTex = new BoardTexture('issues');
  const scenesTex = new ScenesBoardTexture();
  const renderIssuesBoard = () => {
    if (academy()) {
      scenesTex.render(scenesForCity(cityId()), cityName());
      if (office.boardMeshes.issues) showOn(office.boardMeshes.issues, scenesTex.texture);
      return;
    }
    const off = offBoard();
    issuesTex.render({ ...store.issues, items: store.issues.items.filter((i) => !off.has(i.number) && !inProgress(i, store.taskForIssue(i.number))) });
    if (office.boardMeshes.issues) showOn(office.boardMeshes.issues, issuesTex.texture);
  };
  mountBoard(office.boardMeshes.issues, issuesTex.texture, renderIssuesBoard, ['issues', 'queue']);
  let carriedOff = '';
  store.on('peers', () => {
    const k = [...offBoard()].join(',');
    if (k === carriedOff) return;
    carriedOff = k;
    renderIssuesBoard();
  });
  function cardMoved() {
    carriedOff = [...offBoard()].join(',');
    renderIssuesBoard();
  }

  const pullsTex = new BoardTexture('pulls');
  const phrasesTex = new PhrasesBoardTexture();
  const renderPullsBoard = () => {
    if (academy()) {
      phrasesTex.render(phrasesForCity(cityId()), cityName());
      if (office.boardMeshes.pulls) showOn(office.boardMeshes.pulls, phrasesTex.texture);
      return;
    }
    pullsTex.render(store.pulls, store.workers);
    if (office.boardMeshes.pulls) showOn(office.boardMeshes.pulls, pullsTex.texture);
  };
  mountBoard(office.boardMeshes.pulls, pullsTex.texture, renderPullsBoard, ['pulls']);
  let deskLinks = '';
  store.on('workers', () => {
    const k = JSON.stringify([...store.workers.values()].filter((w) => w.worktree).map((w) => [w.worktree!.branch, w.pr?.number, w.name, w.color, w.deskId]));
    if (k === deskLinks) return;
    deskLinks = k;
    renderPullsBoard();
    renderQueueBoard();
  });

  const servicesTex = new ServicesBoardTexture();
  const renderServicesBoard = () => servicesTex.render(store.services.items, store.workers);
  mountBoard(office.boardMeshes.services, servicesTex.texture, renderServicesBoard, ['services', 'workers']);

  const queueTex = new QueueBoardTexture();
  const practiceTex = new PracticeQueueTexture();
  const renderQueueBoard = () => {
    if (academy()) {
      practiceTex.render({ cityName: cityName(), active: practiceActive(), upNext: scenesForCity(cityId()).slice(0, 3) });
      if (office.boardMeshes.queue) showOn(office.boardMeshes.queue, practiceTex.texture);
      return;
    }
    queueTex.render(store.queue, store.workers);
    if (office.boardMeshes.queue) showOn(office.boardMeshes.queue, queueTex.texture);
  };
  mountBoard(office.boardMeshes.queue, queueTex.texture, renderQueueBoard, ['queue', 'workers']);

  store.on('mode', () => {
    renderIssuesBoard();
    renderPullsBoard();
    renderQueueBoard();
    syncAcademySkin();
    ctx.hud.refresh();
  });
  store.on('floor', () => {
    renderIssuesBoard();
    renderPullsBoard();
    renderQueueBoard();
  });
  store.on('floors', () => {
    renderIssuesBoard();
    renderPullsBoard();
    renderQueueBoard();
  });

  function syncAcademySkin() {
    const mode = store.mode;
    office.setBoardLabels?.(boardLabelsFor(mode));
    office.setKioskSigns?.({
      issues: kioskSignFor(mode, 'issues'),
      pulls: kioskSignFor(mode, 'pulls'),
      queue: kioskSignFor(mode, 'queue'),
    } satisfies Record<StationKind, string>);
    skinIdleAgents(deps.idleAgents(), mode);
  }
  syncAcademySkin();

  ctx.interactions.define('issues', {
    reach: 9,
    hint: () => {
      if (academy()) return boardHint('🎭 Scenes board');
      const aimedNote = deps.aimedNote();
      if (aimedNote) return { k: String(aimedNote.number), parts: [hintTitle(clip(`📌 #${aimedNote.number} ${aimedNote.title}`, 60)), key('E', 'Take it'), key('O', 'Read it')] };
      return issuesTex.hasNotes ? { k: 'notes', parts: [hintTitle('📌 Issues board'), key('E', 'Open'), aside('or point at a note to take it')] } : boardHint('📌 Issues board');
    },
    use: (_it, keyCode, note) => {
      if (academy()) {
        if (keyCode === 'E') openScenesBoard(scenesForCity(cityId()), cityName());
        return;
      }
      if (note && keyCode === 'E') return deps.pickUp(note);
      if (note && keyCode === 'O') return openIssue(note, ctx.net, deps.boardActions());
      if (keyCode === 'E') openBoard('issues', ctx.net, deps.boardActions());
    },
  });
  ctx.interactions.define('pulls', {
    reach: 9,
    hint: () => boardHint(academy() ? '💬 Phrase wall' : '🔀 Pull request board'),
    use: onE(() => (academy() ? openPhrasesBoard(phrasesForCity(cityId()), cityName()) : openBoard('pulls', ctx.net, deps.boardActions()))),
  });
  ctx.interactions.define('services', {
    reach: 9,
    hint: () => boardHint(academy() ? '🌐 Services (staff)' : '🌐 Services board'),
    use: onE(() => openServices()),
  });
  ctx.interactions.define('queue', {
    reach: 9,
    hint: () => {
      if (academy()) {
        const n = practiceActive().length;
        return { k: String(n), parts: [hintTitle(`📋 Practice queue${n ? ` · ${n}` : ''}`), key('E', 'Open')] };
      }
      const n = store.queue.tasks.filter((t) => t.status !== 'done').length;
      return { k: String(n), parts: [hintTitle(`📋 Task queue${n ? ` · ${n}` : ''}`), key('E', 'Open')] };
    },
    use: onE(() => {
      if (academy()) {
        openPracticeQueue({
          cityName: cityName(),
          active: practiceActive(),
          upNext: scenesForCity(cityId()).slice(0, 4),
          onStartScene: startScene,
        });
        return;
      }
      deps.showQueue();
    }),
  });

  const machineTex = new MachineTexture();
  mountBoard(office.machineScreen, machineTex.texture, () => machineTex.render(store.machine), ['machine']);
  const meetingBoardTex = new MeetingBoardTexture();
  mountBoard(office.meetingBoard, meetingBoardTex.texture, () => meetingBoardTex.render(store.meeting), ['meeting']);
  const meetingSignTex = new MeetingSignTexture();
  mountBoard(office.meetingSign, meetingSignTex.texture, () => meetingSignTex.render(store.meeting), ['meeting']);

  function dressBoards(w: World) {
    if (academy()) {
      showOn(w.boardMeshes.issues, scenesTex.texture);
      showOn(w.boardMeshes.pulls, phrasesTex.texture);
      showOn(w.boardMeshes.queue, practiceTex.texture);
    } else {
      showOn(w.boardMeshes.issues, issuesTex.texture);
      showOn(w.boardMeshes.pulls, pullsTex.texture);
      showOn(w.boardMeshes.queue, queueTex.texture);
    }
    showOn(w.boardMeshes.services, servicesTex.texture);
    if (w.meetingBoard) showOn(w.meetingBoard, meetingBoardTex.texture);
    if (w.meetingSign) showOn(w.meetingSign, meetingSignTex.texture);
  }

  return { issuesTex, renderPullsBoard, renderServicesBoard, renderQueueBoard, dressBoards, cardMoved };
}
