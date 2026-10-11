// Loads anime or manga entries (chosen by ?type=anime|manga) from the Kitsu API.
const params = new URLSearchParams(location.search);
const type = params.get('type') === 'manga' ? 'manga' : 'anime';

const grid = document.getElementById('browseGrid');
const statusEl = document.getElementById('browseStatus');
const moreBtn = document.getElementById('browseMore');
document.getElementById('browseTitle').textContent = type;
document.title = type[0].toUpperCase() + type.slice(1) + ' - Browse';

let nextUrl = `https://kitsu.io/api/edge/${type}?page[limit]=20&sort=popularityRank`;

async function load() {
  moreBtn.hidden = true;
  statusEl.textContent = 'Loading…';
  try {
    const res = await fetch(nextUrl, { headers: { Accept: 'application/vnd.api+json' } });
    if (!res.ok) throw new Error(res.status);
    const json = await res.json();
    json.data.forEach(item => grid.appendChild(card(item.attributes)));
    nextUrl = json.links && json.links.next;
    statusEl.textContent = grid.children.length ? '' : 'No results found.';
    moreBtn.hidden = !nextUrl;
  } catch (err) {
    statusEl.textContent = 'Could not load ' + type + ' data. Check your connection and try again.';
  }
}

function card(a) {
  const el = document.createElement('div');
  el.className = 'browse-card';
  const img = document.createElement('img');
  img.src = (a.posterImage && (a.posterImage.small || a.posterImage.original)) || '';
  img.alt = a.canonicalTitle || '';
  const info = document.createElement('div');
  info.className = 'info';
  const t = document.createElement('strong');
  t.textContent = a.canonicalTitle || 'Untitled';
  const meta = document.createElement('small');
  meta.textContent = [a.subtype, a.averageRating && a.averageRating + '%'].filter(Boolean).join(' · ');
  info.append(t, document.createElement('br'), meta);
  el.append(img, info);
  return el;
}

moreBtn.addEventListener('click', load);
load();
