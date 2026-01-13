import { Container } from "../layout/Container";

export function Contact() {
  return (
    <section>
      <Container>
        <h2>Contact</h2>

        <p>
          If you’d like to discuss engineering work, systems design, or potential
          opportunities, feel free to reach out.
        </p>

        <p>
          <a href="mailto:aryanprakash1275@gmail.com">
            aryanprakash1275@gmail.com
          </a>
        </p>

        <p>
          <a
            href="/Aryan_Prakash_Backend_FullStack_Developer.pdf"
            target="_blank"
            rel="noreferrer"
          >
            Resume
          </a>{" "}
          ·{" "}
          <a
            href="https://github.com/AryanPrakash1275"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>{" "}
          ·{" "}
          <a
            href="https://www.linkedin.com/in/aryan-prakash-3946a4157/"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
        </p>
      </Container>
    </section>
  );
}
