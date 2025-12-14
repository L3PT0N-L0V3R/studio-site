import { Container } from "@/components/layout/container";

export function Footer() {
  return (
    <footer className="border-t">
      <Container className="py-10 text-sm text-zinc-600">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>© {new Date().getFullYear()} Studio. All rights reserved.</div>
          <div className="flex gap-4">
            <a className="hover:text-zinc-900" href="#work">Work</a>
            <a className="hover:text-zinc-900" href="#contact">Contact</a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
