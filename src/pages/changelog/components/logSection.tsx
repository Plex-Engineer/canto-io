import { Text } from "global/packages/src";

interface Props {
  date: string;
  title: string;
  content: string;
}
const LogSection = ({ date, title, content }: Props) => {
  return (
    <div className="section">
      <Text type="title" size="title3" className="header">
        {date}
      </Text>

      <div className="changes">
        <Text type="title" align="left" size="title2">
          {title}
        </Text>
        {content.split("\n").map((text) => (
          <Text type="text" align="left" key={text}>
            {text}
          </Text>
        ))}
      </div>
    </div>
  );
};

export default LogSection;
