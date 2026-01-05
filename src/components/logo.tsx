import logo from "../assets/menuo-logo-zz-03.svg";

type LogoProps = {
  height?: number;
  className?: string;
};

const Logo = ({ height = 70, className = "" }: LogoProps) => {
  return (
    <img
      src={logo}
      alt="Menup logo"
      style={{ height, objectFit: "contain" }}
      className={className}
    />
  );
};

export default Logo;
