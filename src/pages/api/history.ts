import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";

// const urlBase = "https://canary-ethereum.rest.mnemonichq.com";
const urlBase = "https://ethereum.rest.mnemonichq.com";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const address = req.query.address as string;
  const tokenId = req.query.tokenId as string;
  const offset = (req.query.offset as string) || "0";
  const limit = (req.query.limit as string) || "100";

  try {
    const query = new URLSearchParams({
      limit,
      offset,
    }).toString();

    const url = `${urlBase}/events/v1beta1/transfers/${address}/${tokenId}?${query}`;

    const response = await fetch(url, {
      headers: {
        "X-API-Key": process.env.MNEMONIC_API_KEY || "",
      },
    });

    const data = await response.json();

    res.status(200).json(data);
  } catch (e) {
    console.error(e);
    res.status(400);
  }
}
