export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const episodeId = searchParams.get("animeEpisodeId") as string;
    // const server = searchParams.get("server") as
    //   | "hd-1"
    //   | "hd-2"
    //   | "megacloud"
    //   | "streamsb"
    //   | "streamtape";
    const category = searchParams.get("category") as "sub" | "dub" | "raw";

    // Using Animeheaven Stream endpoint
    const gateKey = "6fe1cb6ba828b3af45fa50356c016116";
    const baseUrl = "https://doux.gleeze.com/anime/animeheaven-stream";

    // Build the URL with gateKey and episode parameters
    const url = new URL(baseUrl);
    url.searchParams.append("gateKey", gateKey);
    url.searchParams.append("animeEpisodeId", decodeURIComponent(episodeId));
    if (category) {
      url.searchParams.append("category", category);
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Animeheaven Stream API error: ${response.status}`);
    }

    const data = await response.json();

    return Response.json({ data });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "something went wrong" }, { status: 500 });
  }
}
