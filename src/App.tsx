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

async function fetchLink(retry = 3): ReturnType<typeof fetchOnce> {
  for (let i = 0; i < retry; i++) {
    const result = await fetchOnce();
    if (result) {
      return result;
    }
  }
  return null;
}

function Image() {
  const [url, setUrl] = useState<string>();

  useEffect(() => {
    fetchLink()
      .then((result) => {
        console.log(url);
        if (result) setUrl(result.link);
      })
      .catch((e) => console.error(e));
  }, []);

  if (url) {
    return <embed src={url} />;
  } else {
    return <p>loading...</p>;
  }
}

function App() {
  return (
    <div>
      {new Array(8).fill(0).map((_, i) => (
        <Image key={i} />
      ))}
    </div>
  );
}

export default App;
