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