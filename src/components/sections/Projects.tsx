import { Container } from "../layout/Container";

export function Projects() {
  return (
    <section id="projects">
      <Container>
        <h2>Projects</h2>

        <h3>Autorovers — Vehicle discovery & comparison platform</h3>

        <p>
          A production-oriented vehicle catalog platform built with clean
          architecture principles. Focused on data modeling, filtering,
          comparison logic, SEO-friendly routing, and maintainable backend design.
        </p>

        <p>
          <strong>Tech:</strong> ASP.NET Core · Clean Architecture · EF Core ·
          SQL Server · React · TypeScript
        </p>

        <p>
          <a href="https://autorovers.com" target="_blank" rel="noreferrer">
            Live site
          </a>{" "}
          ·{" "}
          <a
            href="https://github.com/AryanPrakash1275/autorovers-frontend-public"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </p>

        <hr />

        <h4>Selected Experiments</h4>

        <ul>
          <li>
            <strong>Tenant Manager</strong> — multi-tenant backend system exploring
            tenant isolation, shared schemas, and authorization boundaries.{" "}
            <a
              href="https://github.com/AryanPrakash1275/multi-tenant-project-manager"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </li>

          <li>
            <strong>Pipeline Builder</strong> — visual DAG-based workflow editor
            focused on node graphs, validation, and execution order.{" "}
            <a
              href="https://github.com/AryanPrakash1275/pipeline-builder"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </li>
        </ul>
      </Container>
    </section>
  );
}
