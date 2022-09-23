import React from "react";

type Props = {
  title: string;
  description?: string;
  image: string;
};

export const getMetaTags = ({ title, description = "", image }: Props) => (
  <>
    <meta key="desc" name="description" content={description} />
    <meta key="img" name="image" content={image} />

    <meta key="t:c" name="twitter:card" content="summary" />
    <meta key="t:t" name="twitter:title" content={title} />
    <meta key="t:d" name="twitter:description" content={description} />
    <meta key="t:i" name="twitter:image" content={image} />

    <meta key="o:t" name="og:title" content={title} />
    <meta key="o:d" name="og:description" content={description} />
    <meta key="o:i" name="og:image" content={image} />
    <meta key="o:t2" name="og:type" content="website" />
  </>
);
