import { useEffect, useState } from "react";
import "./App.css";

type DogLinkResponse = {
  fileSizeBytes: number;
  url: string;
};

async function fetchOnce(): Promise<{ link: string; type: string } | null> {
  const response = await fetch("https://random.dog/woof.json");
  const data = (await response.json()) as DogLinkResponse;
  const matches = data.url.match(/(?!\.)\w+$/);
  if (matches && matches.length == 1) {
    switch (matches[0].toLowerCase()) {
      case "jpg":
      case "png":
      case "gif":
      case "mp4":
        return { link: data.url, type: matches[0] };
      default:
        return null;
    }
  } else {
    return null;
  }
}

async function fetchRetry(retry = 3): ReturnType<typeof fetchOnce> {
  for (let i = 0; i < retry; i++) {
    const result = await fetchOnce();
    if (result) {
      return result;
    }
  }
  return null;
}

function Image({ url }: { url: string | null }) {
  if (url) {
    return <embed src={url} />;
  } else {
    return <p>loading...</p>;
  }
}

function App() {
  const [urls, setUrls] = useState<(string | null)[]>(new Array(8).fill(null));

  const fetchData = async () => {
    for (let i = 0; i < 8; i++) {
      fetchRetry().then((result) => {
        if (result) {
          setUrls((v) =>
            v.map((orignal, j) => (i == j ? result.link : orignal)),
          );
        }
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <button onClick={() => fetchData()}>Reload</button>
      <div className="waterfall-container">
        {urls.map((url, i) => (
          <Image url={url} key={i} />
        ))}
      </div>
    </>
  );
}

export default App;
