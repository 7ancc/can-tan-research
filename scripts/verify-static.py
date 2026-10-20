"""Validate the independent GitHub Pages export without third-party dependencies."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import xml.etree.ElementTree as ET
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
SITE = 'https://7ancc.github.io/can-tan-research/'

class Document(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.tags = []
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        self.tags.append((tag, dict(attrs)))

documents = {p.name: Document(p.read_text()) for p in ROOT.glob('*.html')}
assert len(documents) == 26, 'Expected 26 complete pages'
assert not (ROOT / 'CNAME').exists(), 'Do not reuse the original site domain'
assert (ROOT / 'assets/can-tan-academic-cv.pdf').read_bytes().startswith(b'%PDF-')
references = 0
for name, doc in documents.items():
    canonical = [a['href'] for t, a in doc.tags if t == 'link' and a.get('rel') == 'canonical']
    assert canonical == [SITE + ('' if name == 'index.html' else name)], (name, canonical)
    for _, attrs in doc.tags:
        for key in ['href', 'src', 'data-media']:
            value = attrs.get(key, '')
            url = urlsplit(value)
            if not value or url.scheme or url.netloc:
                continue
            assert not url.path.startswith('/'), (name, 'Root-relative URL', value)
            target = (ROOT / unquote(url.path or name)).resolve()
            assert target.is_relative_to(ROOT) and target.is_file(), (name, value)
            if url.fragment and target.suffix == '.html':
                assert any(a.get('id') == unquote(url.fragment) for _, a in documents[target.name].tags), (name, value)
            references += 1
urls = [n.text for n in ET.parse(ROOT / 'sitemap.xml').getroot().iter('{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]
assert len(urls) == 26 and all(u.startswith(SITE) for u in urls)
assert SITE + 'sitemap.xml' in (ROOT / 'robots.txt').read_text()
assert not any(p.is_symlink() for p in ROOT.rglob('*') if '.git' not in p.parts)
print(f'PASS: {len(documents)} pages, {references} local references, PDF, sitemap and independent publication boundary.')
if (ROOT / 'scripts/build.py').is_file():
    subprocess.run([sys.executable, str(ROOT / 'scripts/build.py'), '--check'], check=True)
if (ROOT / 'scripts/verify-v5-1.py').is_file():
    subprocess.run([sys.executable, str(ROOT / 'scripts/verify-v5-1.py')], check=True)
