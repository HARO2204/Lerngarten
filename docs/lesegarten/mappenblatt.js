const ReadingFolderSheet = (() => {
  const columnWidth = 240;
  const bottom = 785;

  async function cropScene(src, tile) {
    const image = new Image();
    image.src = src;
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 260;
    const tileWidth = image.naturalWidth / 3;
    const tileHeight = image.naturalHeight / 2;
    canvas.getContext('2d').drawImage(image, (tile % 3) * tileWidth,
      Math.floor(tile / 3) * tileHeight, tileWidth, tileHeight, 0, 0, 260, 260);
    return canvas.toDataURL('image/jpeg', 0.88);
  }

  function taskBlock(task, index) {
    const commands = [];
    let height = 0;

    function text(content, {x = 0, size = 11, bold = false} = {}) {
      for (const line of DailyTools.wrap(content, columnWidth - x, size)) {
        const y = height;
        commands.push((page, left, top) => page.text(left + x, top + y, line, size, bold));
        height += size * 1.42;
      }
    }

    function box(x, y, size) {
      commands.push((page, left, top) => page.rect(left + x, top + y, size, size, 'white', '#82957a'));
    }

    text((index + 1) + '. ' + task.title, {size: 11.5, bold: true});
    height += 5;
    if (task.grid) {
      const cell = 13;
      for (const square of task.grid.cells) {
        if (!square.active) continue;
        const x = square.x * cell;
        const y = height + square.y * cell - 8;
        box(x, y, cell);
        if (square.num) commands.push((page, left, top) =>
          page.text(left + x + 1.5, top + y + 6, square.num, 6));
      }
      height += task.grid.b.length * cell + 5;
      task.clues.forEach((clue, i) => text((i ? '2 ↓ ' : '1 → ') + clue));
      text('Schreibe in Großbuchstaben.', {size: 9.5});
    } else if (task.items) {
      for (const item of task.items) {
        box(0, height - 8, 9);
        text(item, {x: 16});
        height += 3;
      }
    } else {
      if (task.text) text(task.text);
      if (task.bank) text('Wörter: ' + task.bank, {size: 10});
      if (!task.bank) {
        for (let i = 0; i < 2; i++) {
          height += 18;
          const y = height;
          commands.push((page, left, top) => page.line(left, top + y, left + columnWidth, top + y));
        }
      }
    }
    return {
      height: height + 14,
      draw(page, x, y) { commands.forEach(command => command(page, x, y)); }
    };
  }

  function answerPages(title, tasks) {
    const pages = [];
    let page = DailyTools.page('Lösungen · ' + title, 'LESEGARTEN · 2. KLASSE');
    let y = 127;
    for (const [index, task] of tasks.entries()) {
      const lines = DailyTools.wrap((index + 1) + '. ' + task.answer, 507, 13);
      if (y + lines.length * 19 > bottom) {
        pages.push(page.finish('Lösungen'));
        page = DailyTools.page('Lösungen · ' + title, 'LESEGARTEN · FORTSETZUNG');
        y = 127;
      }
      for (const line of lines) {
        page.text(44, y, line, 13);
        y += 19;
      }
      y += 13;
    }
    pages.push(page.finish('Lösungen'));
    return pages;
  }

  async function create({title, story, image, tile, tasks}) {
    const scene = await cropScene(image, tile);
    const worksheets = [];
    let page = DailyTools.page(title, 'LESEGARTEN · 2. KLASSE');
    page.text(44, 111, 'Name: ___________________________    Datum: _______________', 11);
    page.image(435, 133, 116, 116, scene);
    const storyEnd = page.para(44, 145, story, 367, 13, 1.45);
    let y = Math.max(storyEnd + 10, 268);
    page.text(44, y, 'Löse die Aufgaben. Du darfst im Text nachlesen.', 12, true);
    y += 27;

    const blocks = tasks.map(taskBlock);
    for (let i = 0; i < blocks.length; i += 2) {
      const row = blocks.slice(i, i + 2);
      const height = Math.max(...row.map(block => block.height));
      if (y + height > bottom) {
        worksheets.push(page.finish('Leseblatt'));
        page = DailyTools.page(title, 'LESEGARTEN · AUFGABEN ZUM LESETEXT');
        y = 126;
      }
      row.forEach((block, column) => block.draw(page, 44 + column * 266, y));
      y += height;
    }
    worksheets.push(page.finish('Leseblatt'));
    return {title, area: 'Lesegarten', worksheets, solutions: answerPages(title, tasks)};
  }

  return {create};
})();
