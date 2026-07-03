(function () {
  function normalizeId(raw) {
    var digits = String(raw || '').replace(/\D/g, '');
    return digits ? digits.padStart(4, '0').slice(0, 4) : '';
  }

  function codeFromId(id) {
    var n = normalizeId(id);
    if (!n) return '';
    var g = parseInt(n.slice(0, 2), 10);
    var last = parseInt(n.slice(-1), 10);
    var role = Number.isNaN(last) ? 'PP' : (last % 2 === 0 ? 'PM' : 'PP');
    return 'G' + g + role + '-' + n;
  }

  function clsByGeneration(g) {
    if (g === 1) return { card: 'card-bisneta', img: 'foto-bisneta', label: 'Bisneto (1)' };
    if (g === 2) return { card: 'card-pais', img: 'foto-pais', label: 'Pais (2)' };
    if (g === 3) return { card: 'card-avos', img: 'foto-avos', label: 'Avos (4)' };
    if (g === 4) return { card: 'card-bisavos', img: 'foto-bisavos', label: 'Bisavos (8)' };
    if (g === 5) return { card: 'card-trisavos', img: 'foto-tataravos', label: 'Trisavos (16)' };
    if (g === 6) return { card: 'card-tataravos', img: 'foto-tetravos', label: 'Tetravos' };
    if (g === 7) return { card: 'card-tataravos', img: 'foto-pentaavos', label: 'Pentavos' };
    return { card: 'card-tataravos', img: 'foto-hexaavos', label: 'Hexavos' };
  }

  function expandEntries(entries, sharedBlocks) {
    var output = [];
    (entries || []).forEach(function (entry) {
      if (entry && typeof entry === 'object' && entry.$ref) {
        var refCards = sharedBlocks && sharedBlocks[entry.$ref];
        if (Array.isArray(refCards)) {
          output = output.concat(expandEntries(refCards, sharedBlocks));
        }
        return;
      }
      output.push(entry);
    });
    return output;
  }

  function chunkCards(cards, size) {
    var chunks = [];
    for (var i = 0; i < cards.length; i += size) {
      chunks.push(cards.slice(i, i + size));
    }
    return chunks;
  }

  function renderLine(cards, generation, imagePrefix) {
    if (!cards || !cards.length) {
      return '';
    }

    var cfg = clsByGeneration(generation);
    var rows = generation >= 4 ? chunkCards(cards, 8) : [cards];
    var html = '';
    rows.forEach(function (row) {
      var rowClass = generation >= 4 ? 'linha-geracao linha-8' : 'linha-geracao';
      html += '<div class="' + rowClass + '">';
      row.forEach(function (p) {
        var ramoCls = p.ramo === 'paterno' ? 'ramo-paterno' : 'ramo-materno';
        var id = normalizeId(p.id);
        var isPlaceholder = !id || !!p.placeholder;
        var detalhe = p.detalhe || '';
        var codigo = codeFromId(id);
        var idAttr = id ? ' data-person-id="' + id + '"' : '';
        var imgPrefix = typeof imagePrefix === 'string' ? imagePrefix : '../../';
        var imagem = p && p.imagem ? p.imagem : '';
        html += [
          '<div class="card-pessoa ' + cfg.card + ' ' + ramoCls + '"' + idAttr + '>',
          '<img src="' + imgPrefix + imagem + '" class="' + cfg.img + '" alt="' + (p.nome || '') + '">',
          '<div class="nome">' + (p.nome || '') + '</div>',
          '<div class="detalhe">' + detalhe + '</div>',
          isPlaceholder ? '' : '<span class="card-id">ID ' + id + '</span>',
          isPlaceholder ? '' : '<span class="card-codigo-genealogico">' + codigo + '</span>',
          '</div>'
        ].join('');
      });
      html += '</div>';
    });
    html += '<div class="legenda-linha">' + cfg.label + '</div><div class="linha-separadora"></div>';
    return html;
  }

  window.initArvorePropagacao = async function initArvorePropagacao(opts) {
    var treeKey = opts && opts.treeKey;
    var dataPath = opts && opts.dataPath ? opts.dataPath : '../../dados/arvores-propagacao.json';
    var imagePrefix = opts && Object.prototype.hasOwnProperty.call(opts, 'imagePrefix') ? opts.imagePrefix : '../../';
    var target = document.getElementById(opts && opts.containerId || 'piramide-root');
    if (!treeKey || !target) return;

    var res = await fetch(dataPath, { cache: 'no-store' });
    var data = await res.json();

    var tree = data && data.trees && data.trees[treeKey];
    if (!tree) return;

    var sharedBlocks = data && data.sharedBlocks ? data.sharedBlocks : {};
    var h1 = document.getElementById('arvore-title');
    var h2 = document.getElementById('arvore-subtitle');
    if (h1) h1.textContent = tree.titulo || '';
    if (h2) h2.textContent = tree.subtitulo || '';

    var html = '';
    html += renderLine(expandEntries(tree.g1 || [], sharedBlocks), 1, imagePrefix);
    html += renderLine(expandEntries(tree.g2 || [], sharedBlocks), 2, imagePrefix);
    html += renderLine(expandEntries(tree.g3 || [], sharedBlocks), 3, imagePrefix);
    html += renderLine(expandEntries(tree.g4 || [], sharedBlocks), 4, imagePrefix);
    html += renderLine(expandEntries(tree.g5 || [], sharedBlocks), 5, imagePrefix);
    html += renderLine(expandEntries(tree.g6 || [], sharedBlocks), 6, imagePrefix);
    html += renderLine(expandEntries(tree.g7 || [], sharedBlocks), 7, imagePrefix);
    html += renderLine(expandEntries(tree.g8 || [], sharedBlocks), 8, imagePrefix);

    target.innerHTML = html;

    var lb = document.getElementById('lightbox');
    var lbImg = document.getElementById('lightbox-img');
    target.querySelectorAll('img').forEach(function (img) {
      img.addEventListener('click', function () {
        if (!lb || !lbImg) return;
        lb.style.display = 'flex';
        lbImg.src = img.src;
      });
    });
    if (lb) lb.addEventListener('click', function () { lb.style.display = 'none'; });
  };
})();
