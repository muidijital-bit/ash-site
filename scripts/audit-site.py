#!/usr/bin/env python3
"""Read-only crawl of sitemap pages, SEO metadata, local links and media."""
import argparse, concurrent.futures, json, sys, urllib.request, urllib.error
from collections import Counter
from html.parser import HTMLParser
from urllib.parse import urlsplit, urljoin
from xml.etree import ElementTree as ET

class Page(HTMLParser):
    def __init__(self):
        super().__init__(); self.meta={}; self.links=[]; self.anchors=[]; self.assets=[]; self.headings=[]; self.title=''; self.lang=''; self.ids=[]; self.missing_alt=0; self.schemas=[]; self.active=None; self.ld=False; self.buffer=''
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if tag=='html': self.lang=a.get('lang','')
        if a.get('id'): self.ids.append(a['id'])
        if tag=='meta': self.meta[a.get('name',a.get('property',''))]=a.get('content','')
        if tag=='link':
            self.links.append(a)
            if a.get('rel') in ('stylesheet','icon','apple-touch-icon'): self.assets.append(a.get('href',''))
        if tag=='a': self.anchors.append(a.get('href',''))
        if tag in ('img','source','video'):
            for key in ('src','poster'):
                if a.get(key): self.assets.append(a[key])
            if a.get('srcset'):
                self.assets.extend(item.strip().split()[0] for item in a['srcset'].split(',') if item.strip())
        if tag=='img' and 'alt' not in a: self.missing_alt+=1
        if tag in ('title','h1','h2','h3','h4','h5','h6'): self.active=tag; self.buffer=''
        if tag=='script' and a.get('type')=='application/ld+json': self.ld=True; self.buffer=''
    def handle_data(self,s):
        if self.active or self.ld:self.buffer+=s
    def handle_endtag(self,tag):
        if tag==self.active:
            value=' '.join(self.buffer.split())
            if tag=='title':self.title=value
            else:self.headings.append((tag,value))
            self.active=None; self.buffer=''
        if tag=='script' and self.ld:
            try:self.schemas.append(json.loads(self.buffer))
            except ValueError:self.schemas.append({'INVALID_JSON':True})
            self.ld=False;self.buffer=''

def fetch(url,method='GET'):
    try:
        r=urllib.request.urlopen(urllib.request.Request(url,method=method,headers={'User-Agent':'ASH site QA (read-only)'}),timeout=25)
        return r.status,r.url,dict(r.headers),r.read().decode('utf-8','replace') if method=='GET' else ''
    except urllib.error.HTTPError as e:return e.code,e.url,dict(e.headers),e.read().decode('utf-8','replace') if method=='GET' else ''
    except Exception as e:return 0,url,{},str(e)

def main():
    ap=argparse.ArgumentParser();ap.add_argument('--base',required=True);ap.add_argument('--canonical',required=True);ap.add_argument('--out',default='reports/site-audit.json');ap.add_argument('--assets',action='store_true');args=ap.parse_args()
    base=args.base.rstrip('/');canon=args.canonical.rstrip('/')
    status,_,_,xml=fetch(base+'/sitemap.xml')
    if status!=200:sys.exit(f'Sitemap returned {status}')
    root=ET.fromstring(xml); entries=root.findall('{*}url');paths=[urlsplit(e.find('{*}loc').text).path or '/' for e in entries]
    sitemap_errors=[]
    for e in entries:
        loc=e.find('{*}loc').text
        if not loc.startswith(canon+'/'):sitemap_errors.append('Incorrect domain: '+loc)
        langs={a.get('hreflang'):a.get('href') for a in e.findall('{*}link')}
        if not all(k in langs for k in ['tr','en','x-default']):sitemap_errors.append('Missing language alternate: '+loc)
    pages=[];targets=set();media=set()
    def crawl(path):
        status,final,headers,html=fetch(base+path);p=Page();p.feed(html);errors=[]
        expected=canon+path; canonical=next((x.get('href') for x in p.links if x.get('rel')=='canonical'),None)
        lang='en' if path=='/en' or path.startswith('/en/') else 'tr'
        if status!=200:errors.append(f'HTTP {status}')
        if not p.title:errors.append('Missing title')
        if not p.meta.get('description'):errors.append('Missing description')
        if canonical and canonical.rstrip('/')!=expected.rstrip('/'):errors.append('Incorrect canonical')
        if not canonical:errors.append('Missing canonical')
        if p.lang!=lang:errors.append('Incorrect html lang')
        if sum(t=='h1' for t,s in p.headings)!=1:errors.append('Expected one h1')
        for key in ['og:title','og:description','og:url','og:type','og:locale','og:site_name','og:image','twitter:card','twitter:title','twitter:description','twitter:image']:
            if not p.meta.get(key):errors.append('Missing '+key)
        if p.meta.get('og:url','').rstrip('/')!=expected.rstrip('/'):errors.append('Incorrect og:url')
        alternates={x.get('hreflang'):x.get('href') for x in p.links if x.get('rel')=='alternate'}
        if not all(k in alternates for k in ['tr','en','x-default']):errors.append('Missing hreflang')
        if any(v>1 for v in Counter(p.ids).values()):errors.append('Duplicate HTML id')
        if p.missing_alt:errors.append('Images missing alt attribute')
        if any('INVALID_JSON' in s for s in p.schemas):errors.append('Invalid JSON-LD')
        return {'path':path,'status':status,'final':final,'title':p.title,'description':p.meta.get('description'),'canonical':canonical,'lang':p.lang,'robots':p.meta.get('robots'),'xRobots':headers.get('X-Robots-Tag',headers.get('x-robots-tag')),'meta':p.meta,'alternates':alternates,'headings':p.headings,'schemas':p.schemas,'errors':errors,'anchors':p.anchors,'assets':p.assets,'ids':p.ids}
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:pages=list(pool.map(crawl,paths))
    hostnames={urlsplit(canon).netloc,urlsplit(base).netloc,'aisolution-hub.com'}
    def local_path(u):
        parts=urlsplit(urljoin(base+'/',u))
        return parts.path+('?' + parts.query if parts.query else '') if parts.netloc in hostnames else None
    for p in pages:
        for a in p['anchors']:
            if a.startswith('#'):
                if a[1:] and a[1:] not in p['ids']:p['errors'].append('Missing anchor '+a)
            else:
                target=local_path(a)
                if target:targets.add(target)
        for a in p['assets']+[p['meta'].get('og:image',''),p['meta'].get('twitter:image','')]:
            if a and (target:=local_path(a)):media.add(target)
    checks=[]
    def check(path):
        s,f,h,_=fetch(base+path,'HEAD');return {'path':path,'status':s,'final':f,'type':h.get('Content-Type',h.get('content-type'))}
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:checks=list(pool.map(check,sorted((targets-set(paths)) | (media if args.assets else set()))))
    titles=Counter(p['title'] for p in pages)
    for p in pages:
        if titles[p['title']]>1:p['errors'].append('Duplicate title')
    for path in ['/seo-audit-missing-page','/en/seo-audit-missing-page','/urunler/not-a-product','/en/products/not-a-product']:
        s,f,h,html=fetch(base+path);p=Page();p.feed(html);checks.append({'path':path,'status':s,'expected':404,'noindex':'noindex' in p.meta.get('robots',''),'lang':p.lang})
    redirects=[]
    for path,expected in [('/products','/urunler'),('/contact','/iletisim'),('/our-dna','/neden-ash'),('/tr/products/masraf-x','/urunler/masraf-x'),('/en/news/golge-ai-kurumsal-yapay-zeka','/en/blog/shadow-ai-enterprise-ai')]:
        s,f,h,_=fetch(base+path,'HEAD');redirects.append({'path':path,'status':s,'final':f,'ok':s==200 and urlsplit(f).path==expected})
    robots=fetch(base+'/robots.txt')[3]
    report={'base':base,'canonical':canon,'pageCount':len(pages),'pages':pages,'sitemapErrors':sitemap_errors,'robots':robots,'resources':checks,'redirects':redirects}
    from pathlib import Path
    Path(args.out).parent.mkdir(parents=True,exist_ok=True);Path(args.out).write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    issues=sum(len(p['errors']) for p in pages)+len(sitemap_errors)+sum(c['status']!=c.get('expected',200) or c.get('noindex') is False for c in checks)+sum(not r['ok'] for r in redirects)
    print(json.dumps({'pages':len(pages),'resourcesChecked':len(checks),'issues':issues,'sitemapIssues':len(sitemap_errors),'pageIssues':[{ 'path':p['path'],'errors':p['errors']} for p in pages if p['errors']],'resourceIssues':[r for r in checks if r['status']!=r.get('expected',200) or r.get('noindex') is False],'redirects':redirects,'report':args.out},ensure_ascii=False,indent=2))
    return 1 if issues else 0
if __name__=='__main__':sys.exit(main())
