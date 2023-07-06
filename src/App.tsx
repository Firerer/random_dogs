import { useEffect, useState } from "react";
import "./App.css";

type DogLinkResponse = {
  fileSizeBytes: number;
  url: string;
};

const supportedMedias = ["jpg", "jpeg", "png", "gif", "mp4"] as const;
type supportedMedia = (typeof supportedMedias)[number];

function isSupportedLink(url: string): supportedMedia | null {
  const matches = url.match(/(?!\.)\w+$/);
  if (!matches || matches.length != 1) {
    return null;
  }

  const match = matches[0].toLowerCase();
  if (supportedMedias.includes(match as supportedMedia)) {
    return match as supportedMedia;
  } else {
    return null;
  }
}

if (import.meta.vitest) {
  const { describe, it, assert } = import.meta.vitest;

  describe("isSupportedLink", () => {
    it("should return the extension for supported media types", () => {
      const testCases: { url: string; expected: supportedMedia }[] = [
        { url: "http://example.com/image.jpg", expected: "jpg" },
        { url: "http://example.com/video.mp4", expected: "mp4" },
        { url: "http://example.com/image.gif", expected: "gif" },
        { url: "http://example.com/image.png", expected: "png" },
        { url: "http://example.com/image.jpeg", expected: "jpeg" },
      ];

      for (const { url, expected } of testCases) {
        console.log("ans", isSupportedLink(url));
        assert.strictEqual(isSupportedLink(url), expected);
      }
    });

    it("should return null for unsupported media types", () => {
      const testCases: string[] = [
        "http://example.com/video.avi",
        "http://example.com/",
        "not-a-url",
      ];

      for (const url of testCases) {
        assert.strictEqual(isSupportedLink(url), null);
      }
    });
  });
}

async function fetchRetry(retry = 3): Promise<DogLinkResponse | null> {
  for (let i = 0; i < retry; i++) {
    const response = await fetch("https://random.dog/woof.json");
    const data = (await response.json()) as DogLinkResponse;
    if (isSupportedLink(data.url)) {
      return data;
    }
  }
  return null;
}

function App() {
  const [urls, setUrls] = useState<(string | null)[]>(new Array(8).fill(null));

  const fetchData = async () => {
    const newUrls = await Promise.all(
      urls.map(async (orignal) => {
        const result = await fetchRetry();
        return result ? result.url : orignal;
      }),
    );
    return setUrls(newUrls);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <button onClick={() => fetchData()}>Reload</button>
      <div className="waterfall-container">
        {urls.map((url, i) =>
          url ? (
            <embed className="waterfall-item" key={i} src={url} />
          ) : (
            <p className="waterfall-item" key={i}>
              loading...
            </p>
          ),
        )}
      </div>
    </>
  );
}

export default App;
