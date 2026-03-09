export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const animeEpisodeId = searchParams.get("animeEpisodeId") as string;

    // Using Animeheaven Stream endpoint for servers
    const gateKey = "6fe1cb6ba828b3af45fa50356c016116";
    const baseUrl = "https://doux.gleeze.com/anime/animeheaven-stream";

    // Build the URL with gateKey and episode parameters
    const url = new URL(baseUrl);
    url.searchParams.append("gateKey", gateKey);
    url.searchParams.append("animeEpisodeId", decodeURIComponent(animeEpisodeId));

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Animeheaven Stream API error: ${response.status}`);
    }

    const result = await response.json();
    // Extract server data from the response
    const data = result.data || result;
    return Response.json({ data });
  } catch (err) {
    console.log(err);
    return Response.json({ error: "something went wrong" }, { status: 500 });
  }
}
