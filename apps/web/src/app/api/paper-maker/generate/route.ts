import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts, PDFFont } from 'pdf-lib';

interface SectionData {
  section: {
    title: string;
    instructions: string;
    questionType: string;
    totalQuestions: number;
    attemptQuestions: number;
    marksPerQuestion: number;
  };
  questions: {
    id: string;
    question: string;
    options?: string[];
    answer: string;
    type: string;
  }[];
}

interface PaperData {
  config: {
    classLevel: number;
    boardId: string;
    subjectId: string;
    instituteName: string;
    teacherName: string;
    totalMarks: number;
    timeMinutes: number;
    medium: string;
    includeAnswerKey: boolean;
  };
  sections: SectionData[];
}

const BOARD_NAMES: Record<string, string> = {
  lahore: 'Lahore Board',
  faisalabad: 'Faisalabad Board',
  multan: 'Multan Board',
  gujranwala: 'Gujranwala Board',
  rawalpindi: 'Rawalpindi Board',
  federal: 'Federal Board',
  sindh: 'Sindh Board',
  balochistan: 'Balochistan Board',
  kp: 'KP Board',
};

const SUBJECT_NAMES: Record<string, string> = {
  physics: 'Physics',
  chemistry: 'Chemistry',
  biology: 'Biology',
  mathematics: 'Mathematics',
  computer: 'Computer Science',
  english: 'English',
  urdu: 'Urdu',
  islamiat: 'Islamiat',
  'pak-studies': 'Pakistan Studies',
};

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

export async function POST(req: NextRequest) {
  const paper: PaperData = await req.json();
  const { config, sections } = paper;

  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  const W = 595,
    H = 842; // A4 points
  const ML = 50,
    MR = 50,
    MT = 50;

  const black = rgb(0, 0, 0);
  const dark = rgb(0.15, 0.15, 0.15);
  const mid = rgb(0.4, 0.4, 0.4);
  const light = rgb(0.8, 0.8, 0.8);
  const bgGray = rgb(0.93, 0.93, 0.93);

  let page = doc.addPage([W, H]);
  let y = H - MT;

  const addPage = () => {
    page = doc.addPage([W, H]);
    y = H - MT;
  };

  const checkSpace = (needed: number) => {
    if (y - needed < 60) addPage();
  };

  const drawText = (
    text: string,
    x: number,
    yPos: number,
    size: number,
    f: PDFFont,
    color = black,
    maxW?: number
  ) => {
    if (!text) return;
    const display = maxW ? truncateText(text, f, size, maxW) : text;
    page.drawText(display, { x, y: yPos, size, font: f, color });
  };

  const truncateText = (text: string, f: PDFFont, size: number, maxW: number): string => {
    if (f.widthOfTextAtSize(text, size) <= maxW) return text;
    let t = text;
    while (t.length > 3 && f.widthOfTextAtSize(t + '…', size) > maxW) {
      t = t.slice(0, -1);
    }
    return t + '…';
  };

  const wrapText = (text: string, f: PDFFont, size: number, maxW: number): string[] => {
    const words = text.split(' ');
    const lines: string[] = [];
    let current = '';
    for (const word of words) {
      const test = current ? current + ' ' + word : word;
      if (f.widthOfTextAtSize(test, size) > maxW) {
        if (current) lines.push(current);
        current = word;
      } else {
        current = test;
      }
    }
    if (current) lines.push(current);
    return lines;
  };

  const lineH = (size: number) => size * 1.5;

  // ── HEADER ──────────────────────────────────────────────────────

  // Title block
  if (config.instituteName) {
    drawText(
      config.instituteName,
      W / 2 - fontBold.widthOfTextAtSize(config.instituteName, 14) / 2,
      y,
      14,
      fontBold
    );
    y -= lineH(14);
  }

  const boardName = BOARD_NAMES[config.boardId] || config.boardId;
  const subjectName = SUBJECT_NAMES[config.subjectId] || config.subjectId;
  const boardLine = `${boardName} — Annual Examination ${new Date().getFullYear()}`;
  drawText(boardLine, W / 2 - font.widthOfTextAtSize(boardLine, 10) / 2, y, 10, font, mid);
  y -= lineH(10) + 6;

  // Info box
  const boxH = 48;
  page.drawRectangle({
    x: ML,
    y: y - boxH,
    width: W - ML - MR,
    height: boxH,
    borderColor: black,
    borderWidth: 1,
  });
  const col = (W - ML - MR) / 3;

  // Column separators
  page.drawLine({
    start: { x: ML + col, y: y },
    end: { x: ML + col, y: y - boxH },
    color: black,
    thickness: 0.5,
  });
  page.drawLine({
    start: { x: ML + col * 2, y: y },
    end: { x: ML + col * 2, y: y - boxH },
    color: black,
    thickness: 0.5,
  });

  drawText('Subject', ML + 4, y - 12, 7, font, mid);
  drawText(subjectName, ML + 4, y - 24, 10, fontBold, black, col - 8);
  drawText(
    `Class ${config.classLevel} (${config.classLevel <= 10 ? 'Matric' : 'Inter'})`,
    ML + col + 4,
    y - 20,
    10,
    fontBold
  );
  const marksLabel = `Total Marks: ${config.totalMarks}`;
  drawText(marksLabel, ML + col * 2 + 4, y - 14, 9, fontBold);
  const timeLabel = `Time: ${config.timeMinutes} min`;
  drawText(timeLabel, ML + col * 2 + 4, y - 28, 9, font, mid);

  y -= boxH + 12;

  // Student info line
  const fields = [
    'Student Name: ___________________________',
    'Roll No: ______________',
    `Date: ___________`,
  ];
  fields.forEach((f, i) => {
    drawText(f, ML + (i * (W - ML - MR)) / 3, y, 8, font, dark);
  });
  y -= 20;

  // Divider
  page.drawLine({ start: { x: ML, y }, end: { x: W - MR, y }, color: black, thickness: 2 });
  y -= 14;

  // ── SECTIONS ────────────────────────────────────────────────────

  for (const { section, questions } of sections) {
    checkSpace(60);

    // Section header box
    const secTitleH = 32;
    page.drawRectangle({
      x: ML,
      y: y - secTitleH,
      width: W - ML - MR,
      height: secTitleH,
      color: bgGray,
      borderColor: rgb(0.5, 0.5, 0.5),
      borderWidth: 0.5,
    });
    drawText(section.title, ML + 8, y - 12, 10, fontBold);
    drawText(section.instructions, ML + 8, y - 24, 8, font, dark, W - ML - MR - 150);
    const marksNote = `(${section.attemptQuestions} × ${section.marksPerQuestion} = ${section.attemptQuestions * section.marksPerQuestion} Marks)`;
    drawText(
      marksNote,
      W - MR - font.widthOfTextAtSize(marksNote, 8) - 6,
      y - 20,
      8,
      fontBold,
      mid
    );
    y -= secTitleH + 10;

    if (questions.length === 0) {
      checkSpace(20);
      drawText('[No questions available for selected chapters]', ML, y, 9, font, mid);
      y -= 20;
      continue;
    }

    for (let qi = 0; qi < questions.length; qi++) {
      const q = questions[qi];
      const lines = wrapText(q.question, font, 9.5, W - ML - MR - 60);
      const qH =
        lines.length * lineH(9.5) + (q.options ? 60 : section.questionType === 'long' ? 100 : 55);

      checkSpace(clamp(qH, 50, 200));

      // Q number + marks badge
      drawText(`${qi + 1}.`, ML, y, 9.5, fontBold);
      const badge = `[${section.marksPerQuestion}]`;
      drawText(badge, W - MR - font.widthOfTextAtSize(badge, 8), y, 8, font, mid);

      const qX = ML + 16;
      lines.forEach((line) => {
        drawText(line, qX, y, 9.5, font);
        y -= lineH(9.5);
      });

      // MCQ options
      if (q.type === 'mcq' && q.options) {
        const labels = ['A', 'B', 'C', 'D'];
        const optW = (W - ML - MR - 16) / 2;
        q.options.forEach((opt, oi) => {
          const ox = qX + (oi % 2) * optW;
          if (oi % 2 === 0 && oi > 0) y -= lineH(9);
          const optLine = `○ ${labels[oi]}. ${opt}`;
          drawText(optLine, ox, y, 9, font, dark, optW - 4);
        });
        y -= lineH(9) + 4;
      }

      // Blank lines for short/long
      if (section.questionType !== 'mcq') {
        const lineCount = section.questionType === 'long' ? 7 : 4;
        y -= 4;
        for (let li = 0; li < lineCount; li++) {
          page.drawLine({
            start: { x: qX, y },
            end: { x: W - MR, y },
            color: light,
            thickness: 0.5,
          });
          y -= 14;
        }
      }

      y -= 6;
    }
    y -= 8;
  }

  // ── ANSWER KEY ──────────────────────────────────────────────────

  if (config.includeAnswerKey) {
    addPage();

    page.drawLine({ start: { x: ML, y }, end: { x: W - MR, y }, color: black, thickness: 2 });
    y -= 16;
    const akTitle = '— ANSWER KEY — (For Teacher Use Only)';
    drawText(akTitle, W / 2 - fontBold.widthOfTextAtSize(akTitle, 12) / 2, y, 12, fontBold);
    y -= lineH(12) + 4;

    const note = 'Do not distribute to students';
    drawText(note, W / 2 - font.widthOfTextAtSize(note, 9) / 2, y, 9, font, mid);
    y -= lineH(9) + 12;

    for (const { section, questions } of sections) {
      checkSpace(40);
      drawText(section.title, ML, y, 10, fontBold);
      y -= lineH(10) + 2;

      if (section.questionType === 'mcq') {
        // Inline MCQ answers
        let cx = ML;
        const perRow = 10;
        questions.forEach((q, i) => {
          if (i > 0 && i % perRow === 0) {
            y -= lineH(9);
            cx = ML;
          }
          const ans = `${i + 1}.(${q.answer})  `;
          drawText(ans, cx, y, 9, fontBold);
          cx += fontBold.widthOfTextAtSize(ans, 9) + 4;
        });
        y -= lineH(9) + 8;
      } else {
        questions.forEach((q, i) => {
          checkSpace(30);
          const label = `Q${i + 1}: `;
          drawText(label, ML, y, 9, fontBold);
          const ansLines = wrapText(q.answer, font, 9, W - ML - MR - 30);
          drawText(ansLines[0] || '', ML + fontBold.widthOfTextAtSize(label, 9), y, 9, font, dark);
          y -= lineH(9);
          ansLines.slice(1).forEach((line) => {
            checkSpace(15);
            drawText(line, ML + 20, y, 9, font, dark);
            y -= lineH(9);
          });
          y -= 4;
        });
        y -= 8;
      }
    }
  }

  // ── Footer on all pages ──────────────────────────────────────────
  const pages = doc.getPages();
  pages.forEach((p, i) => {
    const footerText = `Generated by RoughTools.com — Free Exam Paper Generator${config.teacherName ? `  |  ${config.teacherName}` : ''}  |  Page ${i + 1} of ${pages.length}`;
    p.drawText(footerText, { x: ML, y: 30, size: 7, font, color: mid });
    p.drawLine({
      start: { x: ML, y: 40 },
      end: { x: W - MR, y: 40 },
      color: light,
      thickness: 0.5,
    });
  });

  const bytes = await doc.save();
  const buffer = Buffer.from(bytes);

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="exam-paper-class${config.classLevel}-${config.subjectId}.pdf"`,
    },
  });
}
