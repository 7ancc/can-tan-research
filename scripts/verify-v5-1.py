"""V5.1 content and preservation checks, using only the Python standard library."""
from html.parser import HTMLParser
from pathlib import Path
import hashlib
import json
import re

ROOT = Path(__file__).resolve().parents[1]

class Node:
    def __init__(self, tag='', attrs=()):
        self.tag, self.attrs, self.children = tag, dict(attrs), []

    def text(self):
        return ''.join(x.text() if isinstance(x, Node) else x for x in self.children)

    def find(self, predicate):
        return ([self] if predicate(self) else []) + [n for c in self.children if isinstance(c, Node) for n in c.find(predicate)]

    def cls(self, name):
        return name in self.attrs.get('class', '').split()

class Document(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.root = Node()
        self.stack = [self.root]
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        n = Node(tag, attrs)
        self.stack[-1].children.append(n)
        if tag not in {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'}:
            self.stack.append(n)

    def handle_endtag(self, tag):
        for i in range(len(self.stack) - 1, 0, -1):
            if self.stack[i].tag == tag:
                self.stack = self.stack[:i]
                break

    def handle_data(self, data):
        self.stack[-1].children.append(data)

def by_class(root, name):
    return root.find(lambda n: n.cls(name))

home = Document((ROOT / 'index.html').read_text()).root
stats = by_class(home, 'profile-stats')[0]
assert [n.text() for n in stats.find(lambda n: n.tag == 'b')] == ['1st', '3', '2', '90.91/100']
assert len(by_class(by_class(home, 'v51-published')[0], 'pub')) == 3
assert len(by_class(by_class(home, 'v51-submitted')[0], 'pub')) == 2
assert not by_class(home, 'strength-outcomes')
strengths = by_class(home, 'v51-strength')
assert len(strengths) == 3
assert all(len(n.find(lambda x: x.tag == 'a')) == 2 for n in strengths)
assert all('In practice' in n.text() for n in strengths)
assert [n.attrs['href'] for n in by_class(home, 'v51-relevant') for n in n.find(lambda x: x.tag == 'a')] == ['project-credit.html', 'project-nlp.html', '#publications']
assert len(by_class(home, 'v51-core')) == 2
assert len(by_class(home, 'v51-complement')) == 2
assert len(by_class(home, 'v51-tool')) == 3
assert 'English · CET-6' in by_class(home, 'v51-credentials')[0].text()
assert len(by_class(home, 'v51-award')) == 4
assert [n.text() for n in home.find(lambda n: n.tag == 'h2' and n.text() == 'Selected Honours & Awards.')]
assert [n.attrs['data-project'] for n in by_class(home, 'project-card')] == ['credit', 'citrus', 'market', 'climate', 'aviation', 'nlp', 'neural', 'ets', 'healthcare']
for name, course_counts in [('index.html', [4, 8]), ('education.html', [4, 12])]:
    doc = Document((ROOT / name).read_text()).root
    sdu, gou = by_class(doc, 'school-sdu')[0], by_class(doc, 'school-gou')[0]
    assert not by_class(sdu, 'admission-note'), name
    assert len(by_class(gou, 'admission-note')) == 1, name
    assert [len(by_class(s, 'school-courses')[0].find(lambda n: n.tag == 'li')) for s in (sdu, gou)] == course_counts
    assert [len(by_class(s, 'school-honors')[0].find(lambda n: n.tag == 'li')) for s in (sdu, gou)] == [2, 5]
    assert all(v in sdu.text() for v in ['90.91/100', '8/46'])
    assert all(v in gou.text() for v in ['4.13/5.00', '1/151'])

baseline = json.loads((ROOT / 'tests/v5-1-preservation.json').read_text())
for name, digest in baseline['preserved_assets'].items():
    assert hashlib.sha256((ROOT / name).read_bytes()).hexdigest() == digest, name
css = (ROOT / 'assets/v5-1.css').read_text()
assert not re.search(r'\.school[-\w]*', css), 'V5.1 must not restyle Education'
assert '@font-face' not in css and '--font:' not in css and '--serif:' not in css
for p in ROOT.glob('*.html'):
    text = p.read_text()
    assert not re.search(r'sci[-.]?hub', text, re.I), p.name
assert 'Wen Mingming (second and corresponding author)' in (ROOT / 'index.html').read_text()
for fragment in ['Concept Preview', 'What changed?', 'View all18 projects', 'See the evidence',
                 'A brief introduction to how I approach research.',
                 'Published work is separated from submitted manuscripts.',
                 'Specific research tasks I can help advance',
                 'Selected highlights from the full record']:
    assert fragment not in (ROOT / 'index.html').read_text(), fragment
print('PASS: V5.1 publication groups, 9 projects, original Education/fonts/media/CV, and factual placement.')
