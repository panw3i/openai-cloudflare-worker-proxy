addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});
async function handleRequest(request: Request) {
  const TELEGRAPH_URL = "https://api.openai.com";
  const url = new URL(request.url);
  if (url.pathname === "/") {
    const ip = await fetch("https://ifconfig.me/all.json", {
      cf: { cacheTtl: 0 },
    })
      .then((response) => response.json())
      .then((json) => json);

    return new Response(JSON.stringify(ip), {
      headers: { "content-type": "application/json" },
    });
  }

  url.host = TELEGRAPH_URL.replace(/^https?:\/\//, "");
  const modifiedRequest = new Request(url.toString(), {
    headers: request.headers,
    method: request.method,
    body: request.body,
    redirect: "follow",
  });
  const response = await fetch(modifiedRequest);
  const modifiedResponse = new Response(response.body, response);
  modifiedResponse.headers.set("Access-Control-Allow-Origin", "*");
  return modifiedResponse;
}

export {};
