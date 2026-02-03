export async function compileLatexToPdf(tex: string) {
  const url = process.env.LATEX_RENDER_URL;
  const token = process.env.LATEX_RENDER_TOKEN;
  if (!url || !token) {
    throw new Error("LATEX_RENDER_URL or LATEX_RENDER_TOKEN missing");
  }

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": token,
    },
    body: JSON.stringify({ tex }),
  });

  if (!res.ok) {
    throw new Error(`LATEX_RENDER_FAILED_${res.status}`);
  }

  return Buffer.from(await res.arrayBuffer());
}
