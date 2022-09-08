import "./footer.css";
import discordIcon from "../../assets/discordIcon.png";
import gitHubIcon from "../../assets/githubIcon.png";
export const Footer = () => {
  return (
    <footer id="footer" className="site-footer" role="contentinfo">
      <div className="social-wrapper">
        <ul>
          <li>
            <a href="#" target="_blank">
              <img
                src="https://cdn1.iconfinder.com/data/icons/logotypes/32/twitter-128.png"
                alt="Twitter Logo"
                className="social-icon"
              />
            </a>
          </li>
          <li>
            <a href="#" target="_blank">
              <img
                src={discordIcon}
                alt="Twitter Logo"
                className="social-icon"
              />
            </a>
          </li>
          <li>
            <a href="#" target="_blank">
              <img
                src={gitHubIcon}
                alt="Twitter Logo"
                className="social-icon"
              />
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};
