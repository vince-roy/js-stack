import fastifyNextJs from "@fastify/nextjs";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import fastify from "fastify";

import { appRouter } from "@acme/api";
import { createFastifyTRPCContext } from "@acme/api/src/trpc";

export interface ServerOptions {
  dev?: boolean;
  port?: number;
  prefix?: string;
}

export function createServer(opts: ServerOptions) {
  const dev = opts.dev ?? true;
  const port = opts.port ?? 3000;
  const prefix = opts.prefix ?? "/trpc";
  const server = fastify({ logger: dev });

  //   void server.register(fastifyTRPCPlugin, {
  //     prefix,
  //     trpcOptions: { router: appRouter, createContext: createFastifyTRPCContext },
  //   });

  void server.register(fastifyNextJs, { dev }).after(() => {
    server.next("/*");
  });

  //   server.get("/", () => {
  //     return { hello: "wait-on 💨" };
  //   });

  const stop = async () => {
    await server.close();
  };
  const start = async () => {
    try {
      await server.listen({ port });
      console.log("listening on port", port);
    } catch (err) {
      server.log.error(err);
      process.exit(1);
    }
  };

  void start();
  //   return { server, start, stop };
}

createServer({});
