import { Container } from "./Container";

export function Footer() {
  return (
    <footer>
      <Container>
        <small>© {new Date().getFullYear()} Aryan Prakash</small>
      </Container>
    </footer>
  );
}
