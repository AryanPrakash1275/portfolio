import { Container } from "../layout/Container";

export function Skills() {
  return (
    <section>
      <Container>
        <h2>Skills</h2>

        <p>
          I focus on fundamentals first and prefer depth over tool sprawl.
        </p>

        <ul>
          <li>
            <strong>Backend:</strong> C#, ASP.NET Core, Web APIs, EF Core, SQL Server
          </li>
          <li>
            <strong>Frontend:</strong> React, TypeScript, HTML, CSS
          </li>
          <li>
            <strong>Architecture:</strong> Clean Architecture, layered design,
            separation of concerns
          </li>
          <li>
            <strong>Concepts:</strong> async/await, LINQ, data modeling,
            pagination, filtering
          </li>
          <li>
            <strong>Tools:</strong> Git, GitHub, REST, basic Docker exposure
          </li>
        </ul>
      </Container>
    </section>
  );
}
