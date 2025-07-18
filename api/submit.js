
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const token = process.env.GITHUB_TOKEN;
  const repo = 'liuzhenhan0114/Meeting';
  const path = 'queue.json';
  const url = `https://api.github.com/repos/${repo}/contents/${path}`;

  const getRes = await fetch(url, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github.v3+json' }
  });
  const file = await getRes.json();
  const content = Buffer.from(file.content, 'base64').toString();
  const data = JSON.parse(content);
  data.push(req.body);

  const updateRes = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: '用户登记信息',
      content: Buffer.from(JSON.stringify(data, null, 2)).toString('base64'),
      sha: file.sha
    })
  });

  if (updateRes.ok) {
    res.status(200).json({ success: true });
  } else {
    res.status(500).json({ success: false });
  }
}
