interface IUrlShortenerService {
  shorten(url: string): string;
}

interface IUrlShortenerUI {
  urlShortenerService: IUrlShortenerService;

  handleShortenUrl(url: string): string;
}

function generateRandomString(amount: number): string {
  return Math.random().toString(36).substring(2, amount);       
}


class UrlShortener implements IUrlShortenerService {
  usedKeys: string[] = [];

  shorten(url: string): string {
    const key = generateRandomString(12);
    if (key in this.usedKeys) {
      return this.shorten(url);
    }
    this.usedKeys.push(key);

    return `localhost:8080/${key}`;
  }
}

class CachedUrlShortener implements IUrlShortenerService {
  cache: { [k: string]: string } = {};
  private previousSnapshots: CachedUrlShortenerSnapshot[] = [];

  constructor(private urlShortenerService: UrlShortener) {}

  shorten(url: string): string {
    if (!this.cache[url]) {
      this.createSnapshot();
      this.cache[url] = this.urlShortenerService.shorten(url);
    }

    return this.cache[url];
  }

  createSnapshot() {
    this.previousSnapshots.push(new CachedUrlShortenerSnapshot(this, { ...this.cache }));
  }

  undo(): void {
    if (!this.previousSnapshots.length) return;
    
    const previousSnapshot = this.previousSnapshots.pop();

    if (!previousSnapshot) return;
    previousSnapshot.restore();
  }
}

class CachedUrlShortenerSnapshot {
  constructor(
    private cachedUrlShortener: CachedUrlShortener,
    private cache: { [k: string]: string }
  ) {}

  restore(): void {
    this.cachedUrlShortener.cache = this.cache;
  }
}

class UrlShortenerUI implements IUrlShortenerUI {
  urlShortenerService = new CachedUrlShortener(new UrlShortener());

  handleShortenUrl(url: string): string {
    return this.urlShortenerService.shorten(url);
  }

  handleUndo(): void {
    this.urlShortenerService.undo();
  }
}

const urlShortenerui = new UrlShortenerUI();

const googleUrl = urlShortenerui.handleShortenUrl('http://www.google.com');
const googleUrl2 = urlShortenerui.handleShortenUrl('http://www.google.com');
const facebookUrl = urlShortenerui.handleShortenUrl('http://www.facebook.com');
const facebookUrl2 = urlShortenerui.handleShortenUrl('http://www.facebook.com');

console.log(googleUrl);
console.log(googleUrl2);
console.log(facebookUrl);
console.log(facebookUrl2);

urlShortenerui.handleUndo();

const facebookUrl3 = urlShortenerui.handleShortenUrl('http://www.facebook.com');

console.log(facebookUrl3);
