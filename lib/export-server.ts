import initSqlJs from "sql.js"
import type { SqlJsStatic } from "sql.js"
import JSZip from "jszip"
import fs from "fs"
import path from "path"

export interface ExportCard {
  front: string
  back: string
}

export interface ExportDeck {
  name: string
  cards: ExportCard[]
}

let sqlPromise: Promise<SqlJsStatic> | null = null

function getSqlJs() {
  if (!sqlPromise) {
    sqlPromise = (async () => {
      const wasmPath = path.join(
        process.cwd(),
        "node_modules",
        "sql.js",
        "dist",
        "sql-wasm.wasm",
      )
      const wasmBinary = fs.readFileSync(wasmPath).buffer as ArrayBuffer

      const SQL = await initSqlJs({
        wasmBinary,
      })
      return SQL as SqlJsStatic
    })()
  }
  return sqlPromise
}

function escapeSql(str: string): string {
  return str.replace(/'/g, "''")
}

function sanitizeField(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\\n/g, "<br>")
    .replace(/\r?\n/g, "<br>")
}

export async function createAnkiDb(deck: ExportDeck): Promise<Uint8Array> {
  const SQL = await getSqlJs()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = new (SQL as any).Database()
  const ts = Math.floor(Date.now() / 1000)

  const deckId = 1
  const decks = JSON.stringify({
    1: {
      id: deckId,
      name: deck.name,
      mtimeSecs: ts,
      usn: -1,
      desc: "",
      dyn: 0,
      collapsed: false,
      conf: 1,
      extendNew: 10,
      extendRev: 50,
      newToday: [0, 0],
      revToday: [0, 0],
      timeToday: [0, 0],
      lrnToday: [0, 0],
    },
  })

  const models = JSON.stringify({
    1710000000000: {
      id: 1710000000000,
      name: "Gyaru Basic",
      type: 0,
      mod: ts,
      usn: -1,
      sortf: 0,
      did: 1,
      tmpls: [
        {
          name: "Card 1",
          qfmt: "{{Front}}",
          afmt: '{{FrontSide}}\n\n<hr id="answer">\n\n{{Back}}',
          ord: 0,
          bqfmt: "",
          bafmt: "",
          did: null,
          bfont: "",
          bsize: 0,
        },
      ],
      flds: [
        { name: "Front", ord: 0, sticky: false, rtl: false, font: "Arial", size: 20, media: [] },
        { name: "Back", ord: 1, sticky: false, rtl: false, font: "Arial", size: 20, media: [] },
      ],
      css:
        ".card {\n font-family: arial;\n font-size: 20px;\n text-align: center;\n color: black;\n background-color: white;\n}",
      req: [[0, "none", [0]]],
      latexPre:
        "\\documentclass[12pt]{article}\n\\special{paperwidth 3in}\n\\special{paperheight 5in}\n\\begin{document}\n",
      latexPost: "\\end{document}",
    },
  })

  const conf = JSON.stringify({
    activeDecks: [1],
    curDeck: 1,
    newSpread: 0,
    sortType: "noteFld",
    sortBackwards: false,
    addToCur: true,
    dayLearnFirst: false,
    schedVer: 2,
  })

  const dconf = JSON.stringify({
    1: {
      id: 1,
      name: "Default",
      mtimeSecs: ts,
      usn: -1,
      mod: ts,
      maxTaken: 60,
      timer: 0,
      autoplay: true,
      replayq: true,
      new: {
        bury: false,
        delays: [1, 10],
        initialFactor: 2500,
        ints: {
          graduatingInterval: 1,
          easyInterval: 4,
          superGraduatingInterval: 0,
          asSuperGraduating: false,
        },
        order: 0,
        perDay: 20,
        rediscover: 1,
        sort: 1,
      },
      rev: {
        bury: false,
        ease4: 1.15,
        hardFactor: 1.2,
        ivlFuzz: 0.05,
        lapseDelay: 0,
        maxIvl: 36500,
        perDay: 200,
      },
      lapse: {
        delays: [10],
        leechAction: 1,
        leechFails: 8,
        minInt: 1,
        mult: 0,
      },
      dyn: false,
      collapse: false,
      browserCollapsed: false,
    },
  })

  try {
    db.run(`
      CREATE TABLE col (
        id INTEGER PRIMARY KEY, crt INTEGER NOT NULL, mod INTEGER NOT NULL, scm INTEGER NOT NULL,
        ver INTEGER NOT NULL, dty INTEGER NOT NULL, usn INTEGER NOT NULL, ls INTEGER NOT NULL,
        conf TEXT NOT NULL, models TEXT NOT NULL, decks TEXT NOT NULL, dconf TEXT NOT NULL,
        tags TEXT NOT NULL
      )
    `)

    db.run(`
      INSERT INTO col VALUES(
        1, ${ts}, ${ts}, ${ts}, 11, 0, -1, 0,
        '${escapeSql(conf)}',
        '${escapeSql(models)}',
        '${escapeSql(decks)}',
        '${escapeSql(dconf)}',
        '{}'
      )
    `)

    db.run(`
      CREATE TABLE notes (
        id INTEGER PRIMARY KEY, guid TEXT NOT NULL, mid INTEGER NOT NULL,
        mod INTEGER NOT NULL, usn INTEGER NOT NULL, tags TEXT NOT NULL,
        flds TEXT NOT NULL, sfld INTEGER NOT NULL, csum INTEGER NOT NULL,
        flags INTEGER NOT NULL, data TEXT NOT NULL
      )
    `)

    db.run(`
      CREATE TABLE cards (
        id INTEGER PRIMARY KEY, nid INTEGER NOT NULL, did INTEGER NOT NULL,
        ord INTEGER NOT NULL, mod INTEGER NOT NULL, usn INTEGER NOT NULL,
        type INTEGER NOT NULL, queue INTEGER NOT NULL, due INTEGER NOT NULL,
        ivl INTEGER NOT NULL, factor INTEGER NOT NULL, reps INTEGER NOT NULL,
        lapses INTEGER NOT NULL, left INTEGER NOT NULL, odue INTEGER NOT NULL,
        odid INTEGER NOT NULL, flags INTEGER NOT NULL, data TEXT NOT NULL
      )
    `)

    db.run(`
      CREATE TABLE revlog (
        id INTEGER PRIMARY KEY, cid INTEGER NOT NULL, usn INTEGER NOT NULL,
        ease INTEGER NOT NULL, ivl INTEGER NOT NULL, lastIvl INTEGER NOT NULL,
        factor INTEGER NOT NULL, time INTEGER NOT NULL, type INTEGER NOT NULL
      )
    `)

    db.run(`CREATE TABLE graves (usn INTEGER NOT NULL, oid INTEGER NOT NULL, type INTEGER NOT NULL)`)
    db.run(`CREATE INDEX ix_notes_usn ON notes (usn)`)
    db.run(`CREATE INDEX ix_cards_usn ON cards (usn)`)
    db.run(`CREATE INDEX ix_cards_nid ON cards (nid)`)

    db.exec("BEGIN TRANSACTION")

    for (let i = 0; i < deck.cards.length; i++) {
      const card = deck.cards[i]
      const noteId = 1710000000001 + i
      const guid = `gyaru${noteId}`
      const front = sanitizeField(card.front)
      const back = sanitizeField(card.back)
      const flds = `${front}\x1f${back}`

      db.run(
        `INSERT INTO notes (id, guid, mid, mod, usn, tags, flds, sfld, csum, flags, data)
         VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0, 0, '')`,
        [noteId, guid, 1710000000000, ts, -1, "", flds],
      )

      db.run(
        `INSERT INTO cards (id, nid, did, ord, mod, usn, type, queue, due, ivl, factor, reps, lapses, left, odue, odid, flags, data)
         VALUES (?, ?, ${deckId}, 0, ?, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '')`,
        [noteId, noteId, ts],
      )
    }

    db.exec("COMMIT")

    return db.export()
  } finally {
    db.close()
  }
}

export async function generateApkgBuffer(deck: ExportDeck): Promise<ArrayBuffer> {
  const zip = new JSZip()

  const ankiDb = await createAnkiDb(deck)
  zip.file("collection.anki2", ankiDb)

  const media: Record<string, string> = {}
  zip.file("media", JSON.stringify(media))

  const content = await zip.generateAsync({ type: "arraybuffer" })
  return content
}

function escapeTsvField(str: string): string {
  const html = str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\\n/g, "<br>").replace(/\r?\n/g, "<br>")
  if (html.includes("\t") || html.includes("\n") || html.includes('"') || html.includes("<")) {
    return `"${html.replace(/"/g, '""')}"`
  }
  return html
}

export function generateTxtContent(deck: ExportDeck): string {
  const lines = deck.cards.map((card) => `${escapeTsvField(card.front)}\t${escapeTsvField(card.back)}`)
  return lines.join("\n")
}
