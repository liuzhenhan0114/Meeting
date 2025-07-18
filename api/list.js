
export default async function handler(req, res) {
  const response = await fetch('https://raw.githubusercontent.com/liuzhenhan0114/Meeting/main/queue.json');
  const data = await response.json();
  res.status(200).json(data);
}
