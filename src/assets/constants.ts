// import portfolioPic from "./portfolioPic.png"
// import ripplePic from "./ripplePic.png"
// import scrabblePic from "./scrabblePic.png"
// import josephPic from "./josephPic.png"
// import baleinegrisPic from "./baleinegrisPic.png"
import floodFillPic from "./flood-fill-img.png"
// import integralParser from "./integral-parser-pic.png"


interface ContentWithLinks {
  text: string;
  links?: {
    [key: string]: LinkPlaceholder;
  };
}

interface LinkPlaceholder {
  text: string;
  url: string;
}

export const IntroBlurb: ContentWithLinks = {
  text: "This is a simple blog I'm writing as a less fancy version of my portfolio (which lives {portfolioLink}). This website is less about showing off skills and more for project write ups and occasionally thoughts on books or life.",
  links: {
    portfolioLink: {
      text: "here",
      url: "https://portfolio.baleinegris.site",
    },
  },
}

export const ProjectsBlurb: ContentWithLinks = {
  text: "Here are the write-ups for my projects. I wanted a place to nerd out about things like the architecture, the tech stack, and the deployment process. It turns out people aren't very interested in hearing about it, so I figured I would write it on the internet. These serve as devlogs of sorts, longer than a README, and talk about the process of building and deploying these projects, as well as thoughts and things I learned."
  ,
  links: {
  }
}

export const projects = [
    {
      name: "Chat CS Agent",
      img: "/chat-cs-logo.png",
      description: "A Web Crawler which vector embeds chunks from the UofT Department of Computer Science website, used as a knowledge database for a RAG Chatbot.",
      link: "/projects/chat-cs",
      technologies: ["Go", "Qdrant", "React", "LangChain"],
    },
    {
      name: "Rocinante",
      img: "/Rocinante.png",
      description: "My Raspberry Pi 4 web server, running Docker, Nginx, and Let's Encrypt SSL certificates. It hosts all of my projects, including this blog!",
      link: "/projects/rocinante",
      technologies: ["Raspberry Pi", "Nginx", "Docker"]
    },
    {
        name: "Flood Fill",
        img: floodFillPic,
        description: "Web App that uses a custom trained Neural Net to make predictions on flood risks for users to invest confidently. 2nd Place Winner of NewHacks 2024.",
        link: "/projects/flood-fill",
        technologies: ["TensorFlow", "React", "Tailwind", "Python"],
    },
]
//     {
//         name: "Integral Parser",
//         img: integralParser,
//         description: "Chrome Extension that parses raw images of integrals using OpenAI GPT-4o mini and generates a link to the Wolfram Alpha page of this integral.",
//         link: "https://github.com/baleinegris/Integral-Parser-Extension",
//         technologies: ["React", "OpenAI"],
//     },
//     {
//         name: "Portfolio",
//         img: portfolioPic,
//         description: "This website! Built with React, Tailwind CSS, and Three.js.",
//         link: "",
//         technologies: ["React", "Tailwind", "Three.js"],
//     }, 
//     {
//         name: "Scrabble",
//         img: scrabblePic,
//         description: "Online Multiplayer Scrabble web application that allows users to create games, join games, and play against each other in real-time.",
//         link: "https://withcomment.github.io/scrabble/",
//         technologies: ["React", "Java"],

//     },
//     {
//         name: "Ripple: AI Playlist Extender",
//         img: ripplePic,
//         description: "Web application that allows users to sign into their Spotify account and extend their playlists by using Suno AI to AI generate brand new music that matches the feel of the playlist.",
//         link: "https://baleinegris.github.io/suno-extender/",
//         technologies: ["React", "Python", "Firebase"],

//     }, 
//     {
//         name: "Joseph Heath Website",
//         img: josephPic,
//         description: "Personal website created for Professor Joseph Heath at the University of Toronto.",
//         link: "http://individual.utoronto.ca/jheath/",
//         technologies: ["React"],
//     },
//     {
//         name: "Personal Website",
//         img: baleinegrisPic,
//         description: "My first website created. Personal website for blogging and updates. Includes a working Tetris game!",
//         link: "https://baleinegris.github.io/",
//         technologies: ["HTML", "CSS", "JavaScript"],
//     }
// ]

export const technologyColors = {
    "React": "bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent",
    "JavaScript": "bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent",
    "TypeScript": "bg-clip-text text-transparent",
    "Python": "bg-gradient-to-r from-yellow-300 from-50% to-blue-600 bg-clip-text text-transparent",
    "Java": "bg-gradient-to-r from-red-700 to-red-800 bg-clip-text text-transparent",
    "HTML": "bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent",
    "CSS": "bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent",
    "GitHub": "#181717 bg-clip-text text-transparent",
    "SQL": "#4479A1 bg-clip-text text-transparent",
    "GCP": "#4285F4 bg-clip-text text-transparent",
    "Firebase": "bg-gradient-to-r from-orange-500 to-yellow-300 bg-clip-text text-transparent",
    "Three.js": "bg-gradient-to-r to-black from-slate-900 bg-clip-text text-transparent",
    "Tailwind": "bg-cyan-300 bg-clip-text text-transparent",
    "OpenAI": "bg-gradient-to-r from-green-500 to-white bg-clip-text text-transparent",
    "Raspberry Pi": "bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent",
    "Nginx": "bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent",
    "Docker": "bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent",
    "TensorFlow": "bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent",
    "Go": "bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent",
    "Qdrant": "bg-gradient-to-r from-blue-500 to-red-600 bg-clip-text text-transparent",
    "LangChain": "bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent",    
}

export const postBanners = [
  {
    title: "Welcome to the Blog!",
    content: "I just started this new blog! It's a work in progress, but working on it's a nice distraction from work and research. It'll probably be pretty quiet during the school year, but this summer I'll write a few posts about projects or books I'm reading. Stay tuned!",
    date: "July 12, 2025",
    href: "/posts/welcome"
  },
]