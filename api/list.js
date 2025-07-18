export default async function handler(req, res) {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const owner = "liuzhenhan0114";
  const repo = "Meeting";
  const path = "queue.json";

  const headers = {
    Authorization: `token ${GITHUB_TOKEN}`,
    Accept: "application/vnd.github.v3+json",
  };

  const resp = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, { headers });

  if (!resp.ok) {
    return res.status(500).json({ error: "读取失败" });
  }

  const json = await resp.json();
  const content = Buffer.from(json.content, "base64").toString();
  res.status(200).json(JSON.parse(content));
}
