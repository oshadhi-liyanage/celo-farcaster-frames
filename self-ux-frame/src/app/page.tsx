import { Metadata } from "next";
import App from "./app";

const appUrl = process.env.NEXT_PUBLIC_URL;

//
// This is the main frame — the one that appears embedded when we share our link.
//
const frame = {
  version: "next",
  // This is the image displayed when sharing the link.
  imageUrl: `${appUrl}/tipme.png`,
  // This is the button displayed when sharing the link.
  button: {
    title: "Tip Me",
    action: {
      type: "launch_frame",
      name: "Tip Me",
      url: appUrl,
      splashImageUrl: `${appUrl}/celo
      `,
      splashBackgroundColor: "#f7f7f7",
    },
  },
};

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Tip Me",
    openGraph: {
      title: "Tip Me",
      description: "Tip your friends and favorite creators with crypto!",
    },
    other: {
      "fc:frame": JSON.stringify(frame),
    },
  };
}

export default function Home() {
  return <App />;
}
