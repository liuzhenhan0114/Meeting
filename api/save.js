export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const owner = "liuzhenhan0114";
  const repo = "Meeting"; // 比如：Meeting
  const path = "queue.json";

  const headers = {
    Authorization: `token ${GITHUB_TOKEN}`,
    Accept: "application/vnd.github.v3+json",
  };

  // 获取旧的内容
  const resp = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, { headers });
  const json = await resp.json();

  const content = Buffer.from(json.content, "base64").toString();
  const arr = JSON.parse(content);
  arr.push(req.body);

  const newContent = Buffer.from(JSON.stringify(arr, null, 2)).toString("base64");

  const updateResp = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      message: "用户登记",
      content: newContent,
      sha: json.sha,
    }),
  });

  if (updateResp.ok) {
    res.status(200).json({ ok: true });
  } else {
    const err = await updateResp.json();
    res.status(500).json(err);
  }
}
