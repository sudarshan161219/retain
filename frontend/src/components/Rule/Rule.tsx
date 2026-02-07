export const Rule = ({
  valid,
  children,
}: {
  valid: boolean;
  children: React.ReactNode;
}) => {
  return (
    <li
      className={`${valid ? "text-green-500" : "text-red-500"}`}
      style={{ fontSize: "0.8rem" }}
    >
      {valid ? "✔" : "✖"} {children}
    </li>
  );
};
