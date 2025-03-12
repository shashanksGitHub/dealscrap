// Home page functionality moved to landing-page.tsx
import { Redirect } from "wouter";

export default function HomePage() {
  return <Redirect to="/dashboard" />;
}
