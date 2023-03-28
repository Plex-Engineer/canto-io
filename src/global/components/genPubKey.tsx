import { useNavigate } from "react-router-dom";

export const GenPubKey = () => {
  const navigate = useNavigate();

  return (
    <p
      role="button"
      tabIndex={0}
      onClick={() => {
        navigate("/bridge");
      }}
      style={{
        color: "#b73d3d",
        fontWeight: "bold",
        textShadow: "0px 0px black",
        lineHeight: "220%",
        cursor: "pointer",
      }}
    >
      please{" "}
      <span
        style={{
          cursor: "pointer",
          border: "1px solid",
          padding: "6px 1rem",
          borderRadius: "4px",
        }}
      >
        generate a public key
      </span>{" "}
      before bridging assets
    </p>
  );
};
