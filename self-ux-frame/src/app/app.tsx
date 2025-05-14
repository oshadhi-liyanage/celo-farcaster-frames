"use client";

import dynamic from "next/dynamic";

const SelfFrame = dynamic(() => import("~/components/self-frame"), {
  ssr: false,
});

export default function App(
  { title }: { title?: string } = { title: "Tip Me" }
) {
  return <SelfFrame title={title} />;
}
