import React from "react";

export default function Head() {
  return (
    <>
      <title>DylanGPT</title>
      <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
      <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      <link rel='icon' href='/dgpt.webp' />
      <meta
        name='image'
        property='og:image'
        content='https://gpt.dylankotzer.com/DylanGPTLogo.webp'
      />
      <meta property='og:title' content='DylanGPT' />
      <meta
        property='og:description'
        content='An above average GPT-powered Chatbot created by Dylan Kotzer. Give it a shot!'
      />
      <head />
      <meta name='author' content='Dylan Kotzer'></meta>

      <link
        rel='stylesheet'
        href='https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/atom-one-dark-reasonable.min.css'
      />
    </>
  );
}
