import { Helmet } from "react-helmet-async";
import SocialBG from "assets/social-bg.jpg";

interface Props {
  title: string;
  description: string;
  image?: string;
  link: string;
}
const HelmetSEO = (props: Props) => {
  return (
    <>
      <Helmet prioritizeSeoTags>
        <title>{props.title}</title>
        <meta name="title" content={props.title} />
        <meta name="description" content={props.description} />
        <link rel="canonical" href={"/" + props.link} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={"https://canto.io/" + props.link} />
        <meta property="og:title" content={props.title} />
        <meta property="og:description" content={props.description} />
        <meta property="og:image" content={props.image ?? SocialBG} />

        <meta property="twitter:card" content={props.image ?? SocialBG} />
        <meta
          property="twitter:url"
          content={"https://canto.io/" + props.link}
        />
        <meta property="twitter:title" content={props.title} />
        <meta property="twitter:description" content={props.description} />
        <meta property="twitter:image" content={props.image ?? SocialBG} />
      </Helmet>
    </>
  );
};

export default HelmetSEO;
