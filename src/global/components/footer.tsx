import "./footer.css";
import discordIcon from "../../assets/discordIcon.png";
import gitHubIcon from "../../assets/githubIcon.png";
import cantoIcon from "../../assets/Favicon.svg";
export const Footer = () => {
  return (
    <footer id="footer" className="site-footer" role="contentinfo">
      <div className="social-wrapper">
        <ul>
          <li>
            <a href="https://docs.canto.io/">
              <img src={cantoIcon} alt="Canto Logo" className="social-icon" />
            </a>
          </li>
          <li>
            <a href="https://twitter.com/CantoPublic">
              <img
                src="https://cdn1.iconfinder.com/data/icons/logotypes/32/twitter-128.png"
                alt="Twitter Logo"
                className="social-icon"
              />
            </a>
          </li>
          <li>
            <a href="https://discord.gg/N3BxQhRx">
              <img
                src={discordIcon}
                alt="Discord Logo"
                className="social-icon"
              />
            </a>
          </li>
          <li>
            <a href="https://github.com/Plex-Engineer/cantomaster">
              <img src={gitHubIcon} alt="Github Logo" className="social-icon" />
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};
