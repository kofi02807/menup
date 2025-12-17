// src/Message.tsx
import { ReactNode } from "react";

type MessageProps = {
  type?: "success" | "danger" | "info" | "warning";
  children: ReactNode;
};

const Message = ({ type = "info", children }: MessageProps) => {
  return <div className={`alert alert-${type}`} role="alert">{children}</div>;
};

export default Message;
