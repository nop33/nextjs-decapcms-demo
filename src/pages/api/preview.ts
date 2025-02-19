import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Check the secret to prevent unauthorized access
  if (req.query.secret !== process.env.NEXT_PREVIEW_SECRET) {
    return res.status(401).json({ message: "Invalid token" });
  }

  // // Set Preview Mode Cookies
  // res.setPreviewData({});

  // // Redirect to the previewed page
  // res.writeHead(307, { Location: req.query.slug ? `/${req.query.slug}` : "/" });
  // res.end();

  // Fetch the headless CMS to check if the provided `slug` exists
  // getPostBySlug would implement the required fetching logic to the headless CMS
  // const post = await getPostBySlug(req.query.slug);

  // Enable Draft Mode by setting the cookie
  res.setDraftMode({ enable: true });

  // Redirect to the path from the fetched post
  // We don't redirect to req.query.slug as that might lead to open redirect vulnerabilities
  if (req.query.slug && typeof req.query.slug === "string") res.redirect(req.query.slug);
};

export default handler;

export async function getStaticProps(context: { draftMode: boolean; params: { slug: string } }) {
  const isPreview = context.draftMode || false;

  // Fetch draft content if preview is enabled
  const source = isPreview
    ? `https://raw.githubusercontent.com/nop33/nextjs-decapcms-demo/cms/draft-${context.params.slug}.md`
    : `https://raw.githubusercontent.com/nop33/nextjs-decapcms-demo/main/content/blog/posts/${context.params.slug}.md`;

  const res = await fetch(source);
  const content = await res.text();

  return {
    props: { content },
    revalidate: 60, // Regenerate every minute
  };
}
