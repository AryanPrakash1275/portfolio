import { Container } from "../layout/Container";

export function Hero() {
  return (
    <section>
      <Container>
        <h1>Building real systems.</h1>

        <p>
          Full-stack developer focused on clean architecture, backend fundamentals,
          and production-ready code.
        </p>

        <p>
          I build credibility-first projects to learn deeply and ship correctly.
        </p>

        <div style={{ marginTop: "1.5rem" }}>
          <a href="#projects">View Projects</a>{" "}
          <a
            href="/Aryan_Prakash_Backend_FullStack_Developer.pdf"
            target="_blank"
            rel="noreferrer"
            style={{ marginLeft: "1rem" }}
          >
            Resume
          </a>{" "}
          <a
            href="https://github.com/AryanPrakash1275"
            target="_blank"
            rel="noreferrer"
            style={{ marginLeft: "1rem" }}
          >
            GitHub
          </a>
        </div>
      </Container>
    </section>
  );
}
