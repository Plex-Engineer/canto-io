interface DualType {
  iconLeft: string;
  iconRight: string;
}
const IconPair = (props: DualType) => {
  return (
    <span
      style={{
        display: "flex",
        alignContent: "center",
        alignItems: "center",
      }}
    >
      <img src={props.iconLeft} height={40} />
      <img
        src={props.iconRight}
        height={35}
        style={{
          marginLeft: "-0.7rem",
        }}
      />
    </span>
  );
};

export default IconPair;
