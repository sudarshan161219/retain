export const Rule = ({
  valid,
  children,
}: {
  valid: boolean;
  children: React.ReactNode;
}) => {
  return (
    <li style={{ color: valid ? "green" : "red", fontSize: "0.8rem" }}>
      {valid ? "✔" : "✖"} {children}
    </li>
  );
};
