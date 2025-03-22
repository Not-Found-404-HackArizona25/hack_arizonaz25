import { Link } from "react-router";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "FORWARD" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <div><Link to="/login">Login</Link><br/><Link to="/login">Register</Link></div>;
}
